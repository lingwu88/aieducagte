<template>
	<view class="chat-container">
		<!-- Header -->
		<view class="header">
			<view class="navigation-icon" @click="back"></view>
			<view class="title">课程规划与建议</view>
		</view>

		<!-- Chat List -->
		<scroll-view id="chatScrollView" class="chat-list" scroll-y="true" :scroll-top="programmaticScrollTop"
			:scroll-with-animation="true" @scroll="handleScroll" @scrolltoupper="handleScrollToUpper" >
			<view v-for="message in messageList" :key="message.id" :id="message.id" class="message-item-wrapper">
				<!-- AI Message -->
				<view v-if="message.sender === 'ai'" :class="['message-item', 'ai-message']">
					<image src="http://120.24.243.227:13100/api/static/pictures/ai-avatar-1.jpg" class="avatar ai-avatar"></image>
					<view class="message-content">
						<view class="content-wrapper">
							<mp-html class="html-content" :content="message.content" v-if="message.content" />
						</view>
						<view class="indicator-wrapper">
							<view v-if="message.isLoading">
								<view v-if="!message.hasReceivedData" class="thinking-indicator">
									<text>AI 正在思考中</text>
									<view class="dot"></view>
									<view class="dot"></view>
									<view class="dot"></view>
								</view>
								<view v-else class="loading-indicator">
									<view class="dot"></view>
									<view class="dot"></view>
									<view class="dot"></view>
								</view>
							</view>
							<view v-else-if="message.isError" class="error-indicator">[发送失败]</view>
						</view>
					</view>
				</view>
				<!-- User Message -->
				<view v-else-if="message.sender === 'user'" :class="['message-item', 'user-message']">
					<view class="message-content">
						<view class="content-wrapper">
							<text v-if="!message.contentType || message.contentType === 'text'" selectable>{{ message.content }}</text>
							<!-- Voice bubble (Example placeholder) -->
							<!-- <view v-else-if="message.contentType === 'voice'" class="voice-bubble" @tap="playVoice(message.content)"> Voice Message </view> -->
						</view>
						<!-- User messages typically don't have loading/error indicators directly in the bubble -->
					</view>
					<image src="http://120.24.243.227:13100/api/static/pictures/user-avatar-1.png" class="avatar user-avatar"></image>
				</view>
			</view>
		</scroll-view>

		<!-- Input Area -->
		<view class="input-area">
			<view class="input-wrapper">
				<view class="input-box" v-if="!isVoiceMode">
					<textarea
						v-model="inputText"
						:adjust-position="false"
						:cursor-spacing="20"
						auto-height
						:show-confirm-bar="false"
						placeholder="请输入您的问题..."
						:maxlength="-1"
						@focus="handleFocus"
						@blur="handleBlur"
						class="input-textarea"
					/>
				</view>
				<!-- Voice input (Example placeholder) -->
				<!-- <view v-else class="voice-input" @touchstart="startRecording" @touchend="stopRecording" @touchcancel="cancelRecording">{{ isRecording ? '松开发送' : '按住说话' }}</view> -->
			</view>
			<view class="send-btn" :class="{ active: canSend }" @tap="handleSend">发送</view>
		</view>
	</view>
</template>

<script>
// import { saveConversation } from '../learnDashboard/components/saveConversation.vue'; // Optional local save function
import mpHtml from '../../components/mp-html/components/mp-html/mp-html';
import { regexSSE } from '../../tools/tool';
import { convertMarkdown } from '../../tools/markdownUtils';
import pageTime from '../../mixins/pageTime'; // Assumes this mixin exists and works

// Optional: Voice related imports/constants if needed
// const recorderManager = uni.getRecorderManager();
// const innerAudioContext = uni.createInnerAudioContext();

export default {
	mixins: [pageTime], // Include mixin if used
	components: { mpHtml },
	data() {
		return {
			// --- Core Data & Form ---
			form: { userId: '', query: '', conversationId: '' },
			inputText: '',
			messageList: [], // Stores chat messages {id, sender, contentType, content, timestamp, isLoading?, isError?, hasReceivedData?}

			// --- Component State Flags ---
			isLoading: false, // General loading state (e.g., for initial history load, not used here currently)
			isVoiceMode: false, // For switching between text/voice input
			isRecording: false, // If voice input is active
			isFinish: false, // Flag indicating the SSE connection itself has been closed by the server or an error
			aiResponseBuffer: '', // Temporary buffer for incoming SSE data chunks
			isProcessingBuffer: false, // Flag to ensure only one buffer processing loop runs at a time
			userHasScrolledUp: false, // Flag to track if the user has manually scrolled away from the bottom
			isNearBottom: true, // Flag indicating if the scroll view is currently near the bottom
			isScrolling: false, // Flag used for throttling scroll event handling (optional)

			// --- UI & Scroll Control ---
			programmaticScrollTop: 0, // ADDED: Controls scroll position directly
			scrollTopUpdateTimer: null, // ADDED: Timer for throttling scroll updates
			scrollViewHeight: 0, // Height of the scrollable area (obtained in onReady)
			currentScrollTop: 0, // Current vertical scroll position
			currentScrollHeight: 0, // Last known scroll height from @scroll
			scrollThreshold: 80, // Pixel distance from bottom to be considered "near bottom"
			scrollTimer: null, // Timer used for scroll event throttling (optional)

			// --- Other State ---
			initialQuery: null, // Stores query passed via navigation options
			planId: '', // Placeholder for potential future features like saving plans
			isStarred: false, // Placeholder for potential future starring feature
			lastFinalizedMessageId: null // Tracks the ID of the last AI message finalized to prevent duplicates
		};
	},
	async onLoad(options) {
		// 1. Get User ID from storage
		if (uni.getStorageSync('userId')) {
			this.form.userId = uni.getStorageSync('userId');
			console.log('User ID:', this.form.userId);
		} else {
			console.error('User ID not found in storage!');
			uni.showToast({ title: '请先登录', icon: 'none', duration: 2000 });
			setTimeout(() => uni.navigateBack(), 2000); // Go back after showing toast
			return; // Stop execution if no user ID
		}

		// 2. Store initial query if passed via navigation
		if (options?.query) {
			this.initialQuery = decodeURIComponent(options.query);
			console.log('Initial Query received:', this.initialQuery);
		}

		// 3. Get Session ID and process initial query (if any)
		try {
			await this.getSessionId(); // Wait for session ID retrieval
			console.log('Conversation ID obtained successfully in onLoad.');

			if (this.initialQuery) {
				// If there was an initial query
				console.log('Processing initial query now...');
				this.addUserMessage(this.initialQuery); // Display user's initial message
				this.scrollToBottom(true); // Force scroll to show it immediately
				this.triggerAiResponse(this.initialQuery); // Start AI response process
				this.initialQuery = null; // Clear initial query after processing
			}
		} catch (error) {
			console.error('Failed to initialize session in onLoad:', error);
			if (this.initialQuery) {
				// If init failed but had initial query
				this.addUserMessage(this.initialQuery); // Still show user message
				this.addErrorMessage('无法初始化会话'); // Add error message
				this.scrollToBottom(true); // Force scroll to show error
				this.initialQuery = null;
			} else {
				// If init failed without initial query
				uni.showToast({ title: '会话初始化失败', icon: 'none' });
			}
		}
	},
	mounted() {
		// Optional: Call methods from mixins or perform other setup after component is mounted
		// this.checkUserId?.();
		// this.setType?.(1);
		// Optional: Initialize voice recording if needed
		// this.initRecorder?.();
		// this.initAudioContext?.();
	},
	onReady() {
		// Get the scroll-view's height once the component is ready
		this.getScrollViewHeight();
	},
	methods: {
		/**
		 * Navigates back to the previous page.
		 */
		back() {
			uni.navigateBack({ delta: 1 });
		},

		// --- Message Handling Methods ---

		/**
		 * Adds a user message to the message list.
		 * @param {string} content - The text content of the message.
		 * @param {string} [contentType='text'] - The type of content ('text', 'voice', etc.).
		 */
		addUserMessage(content, contentType = 'text') {
			const userMessage = {
				id: `msg-${Date.now()}-user-${Math.random().toString(16).slice(2)}`, // Added random part for better uniqueness
				sender: 'user',
				contentType: contentType,
				content: content,
				timestamp: new Date()
			};
			this.messageList.push(userMessage);
			// Note: Scrolling is handled after this in handleSend or onLoad
		},

		/**
		 * Adds a placeholder for an upcoming AI message (shows loading state).
		 * @returns {string} The ID of the newly added placeholder message.
		 */
		addAiPlaceholderMessage() {
			const aiMessage = {
				id: `msg-${Date.now()}-ai-${Math.random().toString(16).slice(2)}`,
				sender: 'ai',
				content: '', // Initially empty
				isLoading: true, // Mark as loading
				isError: false,
				hasReceivedData: false, // Mark as not having received data yet
				timestamp: new Date()
			};
			this.messageList.push(aiMessage);
			this.$nextTick(() => this.scrollToBottom()); // Attempt conditional scroll after adding placeholder
			return aiMessage.id;
		},

		/**
		 * Adds or replaces the last AI message with an error message.
		 * @param {string} content - The error description.
		 */
		addErrorMessage(content) {
			const errorMessage = {
				id: `msg-${Date.now()}-error-${Math.random().toString(16).slice(2)}`,
				sender: 'ai', // Displayed as if from AI
				content: `[错误] ${content}`,
				isLoading: false,
				isError: true,
				hasReceivedData: true, // Considered as having received (error) data
				timestamp: new Date()
			};
			const lastIndex = this.messageList.length - 1;
			// Replace last message if it's an AI placeholder still loading
			if (lastIndex >= 0 && this.messageList[lastIndex].sender === 'ai' && this.messageList[lastIndex].isLoading) {
				this.$set(this.messageList, lastIndex, errorMessage);
			} else {
				// Otherwise, append the error message
				this.messageList.push(errorMessage);
			}
			this.$nextTick(() => this.scrollToBottom()); // Attempt conditional scroll after adding error
		},

		/**
		 * Appends a chunk of text to the last AI message's content.
		 * Manages the `hasReceivedData` flag. Does NOT handle scrolling.
		 * @param {string} contentChunk - The piece of text to append.
		 */
		updateAiMessageContent(contentChunk) {
			const lastIndex = this.messageList.length - 1;
			// Ensure we are updating the correct message (last one, AI, and loading)
			if (lastIndex >= 0 && this.messageList[lastIndex].sender === 'ai' && this.messageList[lastIndex].isLoading) {
				const msg = this.messageList[lastIndex];
				// Set hasReceivedData flag on the first chunk received
				if (!msg.hasReceivedData && contentChunk) {
					this.$set(msg, 'hasReceivedData', true); // Use $set for Vue 2 reactivity
				}
				// Ensure content is a string before appending
				if (typeof msg.content !== 'string') {
					msg.content = '';
				}
				msg.content += contentChunk; // Append new chunk
				// SCROLLING IS HANDLED ELSEWHERE (processResponseBuffer)
			}
		},

		/**
		 * Finalizes a specific AI message: sets final content, marks loading as false.
		 * Prevents finalizing the same message multiple times.
		 * @param {number} messageIndex - The index of the message in messageList to finalize.
		 * @param {string} finalContent - The complete, processed (e.g., Markdown converted) content.
		 */
		finalizeAiMessage(messageIndex, finalContent) {
			if (messageIndex >= 0 && messageIndex < this.messageList.length && this.messageList[messageIndex].sender === 'ai') {
				const messageId = this.messageList[messageIndex].id;
				// Prevent finalizing if already done or if message somehow isn't loading anymore
				if (this.lastFinalizedMessageId === messageId || !this.messageList[messageIndex].isLoading) {
					// console.warn(`Attempted to finalize message ${messageId} which is already finalized or not loading.`);
					return;
				}
				console.log(`Finalizing message ${messageId} at index ${messageIndex}`);
				const updatedMessage = {
					...this.messageList[messageIndex],
					content: finalContent,
					isLoading: false, // Mark as not loading
					isError: false, // Ensure error flag is off
					hasReceivedData: true // Ensure data flag is on
				};
				this.$set(this.messageList, messageIndex, updatedMessage); // Update messageList reactively
				this.lastFinalizedMessageId = messageId; // Record this message ID as finalized

				// Attempt conditional scroll after DOM update
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			} else {
				console.error(`Invalid index or message type for finalizeAiMessage: index=${messageIndex}`);
			}
		},

		// --- Scroll Control Methods ---

		/**
		 * Gets the height of the scroll-view element and stores it.
		 */
		getScrollViewHeight() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('#chatScrollView')
				.boundingClientRect((data) => {
					if (data && data.height) {
						this.scrollViewHeight = data.height;
						console.log('ScrollView Height:', this.scrollViewHeight);
					} else {
						console.warn('Failed to get scroll view height. Retrying in 500ms...');
						// Retry mechanism in case DOM wasn't fully ready
						setTimeout(() => this.getScrollViewHeight(), 500);
					}
				})
				.exec();
		},

		/**
		 * Handles the scroll event of the scroll-view.
		 * Updates `userHasScrolledUp` flag based on scroll position relative to bottom threshold.
		 * @param {Event} e - The scroll event object.
		 */
		handleScroll(e) {
			const { scrollTop, scrollHeight } = e.detail;
			this.currentScrollTop = scrollTop; // Store current scroll position
			this.currentScrollHeight = scrollHeight; // Store last known scroll height

			// Only update flags if we have the scroll view height
			if (this.scrollViewHeight > 0) {
				// Check if the user is scrolled near the bottom
				const isCurrentlyNearBottom = scrollHeight - this.scrollViewHeight - scrollTop <= this.scrollThreshold;

				if (isCurrentlyNearBottom) {
					// If scrolled back near bottom, reset the manual scroll flag
					if (this.userHasScrolledUp) {
						/* Optional log */
					}
					this.userHasScrolledUp = false;
				} else {
					// Only set the manual scroll flag if user scrolls significantly *up* from the bottom
					// Stricter check to avoid minor scrolls stopping auto-scroll
					const isFarEnoughFromBottom = scrollHeight - this.scrollViewHeight - scrollTop > this.scrollThreshold * 2;
					if (isFarEnoughFromBottom && !this.userHasScrolledUp) {
						// console.log("User scrolled significantly up, pausing auto-scroll.");
						this.userHasScrolledUp = true; // Set the flag
					}
					// Note: userHasScrolledUp is only reset above when *near* the bottom again.
				}
				this.isNearBottom = isCurrentlyNearBottom; // Update general near bottom state
			}
			// DO NOT programmatically set scrollTop here; let the binding handle it based on flags
		},

		/**
		 * Handles the event when the scroll-view is scrolled to the top.
		 * Placeholder for loading more history.
		 */
		handleScrollToUpper() {
			console.log('Scrolled to top - potentially load history');
			// Add logic here to load previous messages if implementing history
		},

		/**
		 * Scrolls the chat list to the bottom programmatically using scrollTop.
		 * @param {boolean} [force=false] - If true, scrolls even if `userHasScrolledUp` is true.
		 */
		scrollToBottom(force = false) {
			// Only scroll if forced OR if the user hasn't manually scrolled up
			if (force || !this.userHasScrolledUp) {
				// Use the last known scrollHeight from the @scroll event as the best available height
				const currentContentHeight = this.currentScrollHeight;

				// Proceed only if heights are valid
				if (currentContentHeight > 0 && this.scrollViewHeight > 0) {
					// Calculate the target scrollTop value to reach the absolute bottom
					const targetScrollTop = currentContentHeight - this.scrollViewHeight;
					// console.log(`Scrolling programmatically. Force: ${force}, UserScrolledUp: ${this.userHasScrolledUp}, TargetScrollTop: ${targetScrollTop}`);

					// Use $nextTick to ensure DOM updates are potentially processed before setting scrollTop
					this.$nextTick(() => {
						// Ensure target is not negative
						this.programmaticScrollTop = Math.max(0, targetScrollTop);
					});
				} else {
					// Fallback: Scroll to a very large number if heights aren't available (less precise)
					// console.warn("Cannot calculate precise scrollToBottom - heights unavailable.", `ScrollH: ${currentContentHeight}, ViewH: ${this.scrollViewHeight}`);
					this.$nextTick(() => {
						this.programmaticScrollTop = 999999;
					});
				}

				// If forced, reset the manual scroll flag and assume we are now near the bottom
				if (force) {
					this.userHasScrolledUp = false;
					this.isNearBottom = true;
				}
			} else {
				// console.log("Auto-scroll skipped as userHasScrolledUp is true.");
			}
		},

		// --- Input Handling Methods ---
		handleFocus() {
			/* Logic on input focus (e.g., hide panels) */
		},
		handleBlur() {
			/* Logic on input blur */
		},

		// --- AI Request & SSE Handling Methods ---

		/**
		 * Initiates the AI response generation process.
		 * Starts SSE connection and calls the main AI generation API.
		 * @param {string} query - The user's query text.
		 */
		generateAi(query) {
			// Pre-checks
			if (!this.form.userId || !this.form.conversationId) {
				this.handleAiError('配置错误');
				return;
			}

			// Reset state for new request
			this.isFinish = false;
			this.lastFinalizedMessageId = null;
			this.aiResponseBuffer = '';

			const requestData = { ...this.form, query };
			console.log('Sending AI request:', requestData);

			try {
				// 1. Start Server-Sent Events (SSE) connection
				this.$api.classManagement.createSSE(
					`/api/ai/createSse?userId=${this.form.userId}`, // Example path
					this.logData,
					(error) => this.handleAiError(`连接中断: ${error}`),
					this.closeSSE
				);
				console.log('SSE connection initiated.');

				// 2. Call the main AI generation API endpoint
				if (typeof this.$api.classManagement.generalAi === 'function') {
					this.$api.classManagement
						.generalAi(requestData)
						.then((res) => console.log('AI API request sent successfully.', res))
						.catch((err) => {
							this.handleAiError(`请求发送失败: ${err.errMsg || '未知错误'}`);
						});
				} else {
					console.error("API function 'generalAi' not found.");
					this.handleAiError('内部接口错误');
				}
			} catch (error) {
				console.error('Error during AI request setup:', error);
				this.handleAiError('无法建立连接');
			}
		},

		/**
		 * Callback function to handle incoming data chunks from the SSE connection.
		 * Appends data to the buffer and starts the processing loop if not running.
		 * @param {any} res - The raw data received from the SSE event.
		 */
		logData(res) {
			try {
				const data = regexSSE(res); // Extract meaningful data
				if (data) {
					this.aiResponseBuffer += data; // Append to buffer
					// If the processing loop isn't already running, start it
					if (!this.isProcessingBuffer) {
						this.processResponseBuffer();
					}
				} else if (typeof res === 'string' && res.includes('data: [DONE]')) {
					console.log('SSE explicit [DONE] signal received.');
				}
			} catch (e) {
				console.error('Error processing SSE data:', e, 'Raw data:', res);
				this.handleAiError('数据解析错误');
			}
		},

		/**
		 * Processes the `aiResponseBuffer` in chunks asynchronously using setTimeout.
		 * Updates the UI, handles throttled scrolling, and manages finalization.
		 */
		processResponseBuffer() {
			// Prevent multiple loops running simultaneously
			if (this.isProcessingBuffer) return;
			this.isProcessingBuffer = true;
			// console.log('Starting buffer processing loop...');

			const processChunk = () => {
				let dataProcessedThisCycle = false; // Track if content was added in this cycle

				// 1. Process a chunk from the buffer if available
				if (this.aiResponseBuffer.length > 0) {
					const chunkSize = Math.min(this.aiResponseBuffer.length, 3); // Can tune chunk size
					const chunk = this.aiResponseBuffer.substring(0, chunkSize);
					this.aiResponseBuffer = this.aiResponseBuffer.substring(chunkSize);
					this.updateAiMessageContent(chunk); // Update the message content (no scroll here)
					dataProcessedThisCycle = true; // Mark data as processed
				}

				// 2. Check if processing should end (Buffer empty AND SSE connection closed)
				if (this.aiResponseBuffer.length === 0) {
					if (this.isFinish) {
						// --- FINALIZATION ---
						console.log('Buffer empty and SSE finished. Finalizing message.');
						this.isProcessingBuffer = false; // Stop the loop flag

						// Find the last AI message that is still marked as loading
						let lastLoadingAiIndex = -1;
						for (let i = this.messageList.length - 1; i >= 0; i--) {
							if (this.messageList[i].sender === 'ai') {
								if (this.messageList[i].isLoading) {
									// Check isLoading flag
									lastLoadingAiIndex = i;
								}
								break; // Only check the last AI message
							}
						}

						// If found and still loading, finalize it
						if (lastLoadingAiIndex !== -1) {
							const msgToFinalize = this.messageList[lastLoadingAiIndex];
							// Double check isLoading state directly before finalizing
							if (msgToFinalize.isLoading) {
								console.log(`Found message to finalize at index ${lastLoadingAiIndex}, ID: ${msgToFinalize.id}`);
								try {
									// Convert the complete content to Markdown HTML
									const finalHtmlContent = convertMarkdown(msgToFinalize.content);
									this.finalizeAiMessage(lastLoadingAiIndex, finalHtmlContent); // Call finalize (includes scroll)
								} catch (e) {
									console.error('Markdown conversion failed during finalization:', e);
									// Fallback to raw content if conversion fails
									this.finalizeAiMessage(lastLoadingAiIndex, msgToFinalize.content);
								}
							} else {
								console.warn(`Message at index ${lastLoadingAiIndex} was no longer loading during finalization check.`);
								// Still attempt scroll in case layout changed
								this.$nextTick(() => this.scrollToBottom());
							}
						} else {
							// No loading message found (might have errored or already finalized)
							console.warn('No loading AI message found to finalize after buffer processed.');
							// Still attempt a conditional scroll in case layout just settled
							this.$nextTick(() => this.scrollToBottom());
						}
						return; // Exit the processChunk function - loop terminates
					} else {
						// Buffer is empty, but SSE connection is still open. Wait for more data.
						// console.log('Buffer empty, waiting for more SSE data...');
						setTimeout(() => {
							// Check flag again before recursing
							if (this.isProcessingBuffer) processChunk();
						}, 100); // Wait 100ms before checking buffer again
						return; // End this specific call to processChunk
					}
				}

				// 3. Throttled Scroll Update (only if data was processed and user hasn't scrolled up)
				if (dataProcessedThisCycle && !this.userHasScrolledUp) {
					this.throttledScrollUpdate(); // Call the throttled scroll function
				}

				// 4. Schedule the next processing cycle if the loop should continue
				if (this.isProcessingBuffer) {
					// Adjust timeout duration to control typing speed (e.g., 50ms)
					setTimeout(processChunk, 50);
				} else {
					// console.log('Buffer processing loop stopped.');
				}
			};

			processChunk(); // Start the first cycle of the loop
		},

		/**
		 * Throttled function to update programmatic scrollTop.
		 * Ensures scroll updates don't happen too frequently during streaming.
		 */
		throttledScrollUpdate() {
			const throttleDelay = 150; // Only update scroll max every 150ms (adjust as needed)
			clearTimeout(this.scrollTopUpdateTimer); // Clear any pending update
			this.scrollTopUpdateTimer = setTimeout(() => {
				// Double-check condition *inside* the timeout callback, state might have changed
				if (!this.userHasScrolledUp && this.scrollViewHeight > 0 && this.currentScrollHeight > 0) {
					const targetScrollTop = this.currentScrollHeight - this.scrollViewHeight;
					// console.log(`Throttled scroll update. Target: ${targetScrollTop}`);
					this.$nextTick(() => {
						// Use nextTick for DOM update timing
						this.programmaticScrollTop = Math.max(0, targetScrollTop);
					});
				}
			}, throttleDelay);
		},

		/**
		 * Callback function invoked when the SSE connection is closed.
		 * Simply marks the `isFinish` flag.
		 * @param {any} id - Optional ID or data passed by the SSE close event/handler.
		 */
		closeSSE(id) {
			console.log('SSE connection closed callback invoked, ID (if any):', id);
			this.isFinish = true; // Mark the SSE stream as finished
			// Finalization is handled by processResponseBuffer checking this flag
		},

		/**
		 * Handles errors related to AI request, SSE connection, or data processing.
		 * Stops processing and updates the last AI message to show an error.
		 * @param {string} [errorMsgPrefix="处理失败"] - A prefix for the error message shown.
		 */
		handleAiError(errorMsgPrefix = '处理失败') {
			console.error('AI Error:', errorMsgPrefix);
			// Stop processing flags
			this.isFinish = true;
			this.isProcessingBuffer = false;
			this.aiResponseBuffer = ''; // Clear buffer

			// Find the last AI message that was loading and update its state to error
			const lastIndex = this.messageList.length - 1;
			if (lastIndex >= 0 && this.messageList[lastIndex].sender === 'ai' && this.messageList[lastIndex].isLoading) {
				const errorMessage = {
					...this.messageList[lastIndex],
					content: `[${errorMsgPrefix}]`, // Display error prefix
					isLoading: false, // Stop loading indicator
					isError: true, // Mark as error
					hasReceivedData: true
				};
				this.$set(this.messageList, lastIndex, errorMessage);
				// Attempt conditional scroll to bring error into view
				this.$nextTick(() => this.scrollToBottom());
			} else {
				// If no loading message found (e.g., error happened before placeholder added),
				// add a new dedicated error message.
				this.addErrorMessage(errorMsgPrefix);
			}
		},

		// --- User Action Methods ---

		/**
		 * Handles the click event of the Send button.
		 * Adds the user message, forces scroll, and triggers the AI response.
		 */
		async handleSend() {
			if (!this.canSend) return; // Ignore if input is empty

			const textToSend = this.inputText.trim();
			this.inputText = ''; // Clear input field immediately

			// 1. Add user message to the list
			this.addUserMessage(textToSend);
			// 2. Force scroll to the bottom to show user message
			this.scrollToBottom(true);

			// Optional: Save conversation locally or to backend if needed
			// try { await saveConversation(textToSend); } catch (err) { console.error('Save conversation failed:', err); }

			// 3. Trigger the AI response process
			this.triggerAiResponse(textToSend);
		},

		/**
		 * Coordinates the process of getting an AI response for a given query.
		 * Adds a placeholder message and calls `generateAi`.
		 * @param {string} query - The query to send to the AI.
		 */
		triggerAiResponse(query) {
			// Ensure session is ready before proceeding
			if (!this.form.conversationId) {
				this.addErrorMessage('会话未就绪');
				return;
			}
			// 1. Add the AI placeholder message (this will trigger a conditional scroll)
			this.addAiPlaceholderMessage();
			// 2. Start the actual AI generation process (SSE + API call)
			this.generateAi(query);
		},

		/**
		 * Retrieves the conversation session ID from the backend API.
		 * Returns a Promise that resolves with the ID or rejects on error.
		 */
		getSessionId() {
			return new Promise((resolve, reject) => {
				if (this.form.conversationId) {
					resolve(this.form.conversationId);
					return;
				}
				if (!this.form.userId) {
					reject('User ID needed');
					return;
				}
				console.log('Requesting new Conversation ID...');
				// Ensure this API call exists and is configured correctly in your project
				this.$api.classManagement
					.getSessionId({ userId: this.form.userId, type: 2 })
					.then((res) => {
						if (res?.data) {
							this.form.conversationId = res.data;
							resolve(res.data);
						} else {
							console.error('Invalid session response:', res);
							reject('Invalid response');
						}
					})
					.catch((err) => {
						console.error('Error getting session ID:', err);
						reject(err);
					});
			});
		},

		/**
		 * Placeholder for handling camera icon click.
		 */
		handleCamera() {
			// Implementation for choosing/uploading images
			uni.showToast({ title: '图片功能待实现', icon: 'none' });
		}

		// --- Optional: Voice Input Methods ---
		// initRecorder() { ... },
		// initAudioContext() { ... },
		// startRecording() { ... },
		// stopRecording() { ... },
		// cancelRecording() { ... },
		// sendVoiceMessage(tempFilePath, duration) { ... },
		// playVoice(filePath) { ... },
		// switchMode() { this.isVoiceMode = !this.isVoiceMode; this.inputText = ''; }
	},
	computed: {
		/**
		 * Determines if the send button should be active based on input text.
		 * @returns {boolean} True if input text is not empty after trimming.
		 */
		canSend() {
			return this.inputText.trim().length > 0;
		}
	},
	onUnload() {
		// Cleanup logic when the page is unloaded
		console.log('Page unloading - cleaning up resources.');
		this.isProcessingBuffer = false; // Ensure buffer processing stops
		this.isFinish = true; // Mark as finished to prevent race conditions
		clearTimeout(this.scrollTimer); // Clear any pending scroll throttle timer
		clearTimeout(this.scrollTopUpdateTimer); // Clear scroll update throttle timer

		// Add any other necessary cleanup, e.g.:
		// - Closing SSE connection if required by your backend/library
		// - Stopping audio playback
	}
};
</script>

<style lang="scss" scoped>
// --- Base Container ---
.chat-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
}

// --- Header ---
.header {
	display: flex;
	align-items: center;
	padding: 80rpx 40rpx 20rpx 40rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #eee;
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	box-sizing: border-box;
	.navigation-icon {
		width: 20rpx;
		height: 20rpx;
		border-left: 5rpx solid #000;
		border-bottom: 5rpx solid #000;
		transform: rotate(45deg);
		margin-right: 30rpx;
		padding: 10rpx;
		margin-left: -10rpx;
		cursor: pointer;
	}
	.title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
		color: #000;
		margin-left: -40rpx;
		padding-right: 40rpx; // Adjust for back button to center title
	}
}

// --- Chat List (Scroll View) ---
.chat-list {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	padding: 30rpx 20rpx;
	box-sizing: border-box;
	background-color: #f5f5f5;
	padding-bottom: 20rpx; // Space at the end of the list
}

// --- Message Wrapper & Item ---
.message-item-wrapper {
	margin-bottom: 40rpx;
	display: flex;
}
.message-item {
	display: flex;
	align-items: flex-start;
	max-width: calc(100% - 120rpx);
	position: relative;
}

// --- Avatar ---
.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 10rpx;
	background-color: #eee;
	flex-shrink: 0;
}
.ai-avatar {
	margin-right: 15rpx;
}
.user-avatar {
	margin-left: 15rpx;
}

// --- Message Bubble ---
.message-content {
	padding: 18rpx 25rpx;
	border-radius: 18rpx;
	font-size: 30rpx;
	line-height: 1.6;
	word-wrap: break-word;
	min-height: 80rpx;
	display: flex;
	flex-direction: column;
	.content-wrapper {
		flex-grow: 1;
		min-height: 1.6em;
	} // Ensure space for at least one line
	.indicator-wrapper {
		// Wrapper for indicators, centered below content
		min-height: 20rpx;
		margin-top: 8rpx; /* Increased margin slightly */
		width: 100%; // Take full width for centering text
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center; // Ensure text inside is centered
	}
}
// User bubble style (points right)
.user-message .message-content {
	background-color: #409eff;
	color: #fff;
	border-radius: 18rpx 18rpx 4rpx 18rpx;
}
// AI bubble style (points left)
.ai-message .message-content {
	background-color: #ffffff;
	color: #333;
	border: 1rpx solid #eee;
	border-radius: 18rpx 18rpx 18rpx 4rpx;
}
.user-message {
	margin-left: auto;
	flex-direction: row;
} // Align user message right
.ai-message {
	margin-right: auto;
	flex-direction: row;
} // Align AI message left

// --- HTML Content (within mp-html) ---
.html-content {
	width: 100%; // Ensure content fills its wrapper
	/deep/ pre {
		// Code blocks
		background-color: #2d2d2d;
		color: #f8f8f2;
		padding: 15rpx;
		border-radius: 8rpx;
		overflow-x: auto;
		font-family: monospace;
		font-size: 26rpx;
		margin: 10rpx 0;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	/deep/ code:not(pre > code) {
		// Inline code
		font-family: monospace;
		background-color: #f0f0f0;
		color: #333;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
		font-size: 0.9em;
	}
	// Basic styles for common markdown elements
	/deep/ p {
		margin: 10rpx 0;
	}
	/deep/ ul,
	/deep/ ol {
		padding-left: 40rpx;
		margin: 10rpx 0;
	}
	/deep/ li {
		margin-bottom: 8rpx;
	}
	/deep/ strong,
	/deep/ b {
		font-weight: bold;
	}
	/deep/ em,
	/deep/ i {
		font-style: italic;
	}
	/deep/ h1,
	/deep/ h2,
	/deep/ h3,
	/deep/ h4,
	/deep/ h5,
	/deep/ h6 {
		font-weight: bold;
		margin: 20rpx 0 10rpx 0;
	}
	/deep/ h1 {
		font-size: 1.5em;
	}
	/deep/ h2 {
		font-size: 1.3em;
	}
	/deep/ h3 {
		font-size: 1.1em;
	}
}

// --- Loading & Error Indicators (Centered by indicator-wrapper) ---
@keyframes blink {
	0%,
	80%,
	100% {
		opacity: 0.3;
	}
	40% {
		opacity: 1;
	}
} // Dot animation
.dot {
	// Base dot style
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background-color: #999;
	margin: 0 4rpx; // Space between dots
	animation: blink 1.4s infinite both; // Apply animation
}
.thinking-indicator {
	// "Thinking..." text + dots
	display: inline-flex; // Allows text and dots on same line, centered by parent flex
	align-items: center;
	color: #999;
	font-size: 26rpx;
	font-style: italic;
	text {
		margin-right: 8rpx;
	} // Space after text
	// Animation delays for dots within this specific indicator
	.dot:nth-of-type(1) {
		animation-delay: 0s;
	}
	.dot:nth-of-type(2) {
		animation-delay: 0.2s;
	}
	.dot:nth-of-type(3) {
		animation-delay: 0.4s;
	}
}
.loading-indicator {
	// Streaming "..." dots only
	display: inline-flex; // Allows dots to be centered by parent flex
	align-items: center;
	.dot {
		// Slightly larger dots for this state
		width: 10rpx;
		height: 10rpx;
		margin: 0 5rpx;
		// Apply animation delays
		&:nth-of-type(1) {
			animation-delay: 0s;
		}
		&:nth-of-type(2) {
			animation-delay: 0.2s;
		}
		&:nth-of-type(3) {
			animation-delay: 0.4s;
		}
	}
}
.error-indicator {
	// Error text style
	color: #fa3534; // Error color
	font-size: 26rpx;
	font-style: italic;
	// Centered by the indicator-wrapper's text-align: center (if needed) or flex properties
}

// --- Input Area ---
.input-area {
	display: flex;
	align-items: flex-end; // Align items to bottom
	padding: 15rpx 20rpx;
	background-color: #f8f8f8; // Slightly different background for input area
	border-top: 1rpx solid #e5e5e5;
	padding-bottom: calc(env(safe-area-inset-bottom) + 15rpx); // Adapt to iPhone bottom safe area
}
.input-wrapper {
	// Wraps the textarea/voice input
	flex: 1; // Take most of the width
	display: flex;
	align-items: flex-end;
	background-color: #ffffff; // White background for input field itself
	border-radius: 15rpx; // Rounded corners for input area
	padding: 10rpx 15rpx; // Inner padding
	margin-right: 20rpx; // Space before send button
	border: 1rpx solid #eee; // Border around input field
	min-height: 70rpx; // Minimum height to match send button
	box-sizing: border-box;
}
.input-box {
	// Contains textarea and maybe icons
	flex: 1;
	display: flex;
	align-items: center;
}
.input-textarea {
	// The text input field
	flex: 1; // Take available horizontal space
	padding: 10rpx 0; // Vertical padding for text inside
	margin: 0; // Reset margin
	max-height: 180rpx; // Limits height before internal scroll appears within textarea
	font-size: 30rpx;
	line-height: 1.5;
	box-sizing: border-box;
	background-color: transparent; // Use parent background
	border: none;
	outline: none; // Remove default textarea borders
	width: 100%; // Ensure it fills the container width
}
.send-btn {
	// The send button
	width: 110rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	background-color: #007aff; // Example theme color
	color: #fff;
	border-radius: 10rpx;
	font-size: 28rpx;
	opacity: 0.6; // Default disabled state opacity
	transition: opacity 0.3s; // Smooth transition for active state
	flex-shrink: 0; // Prevent button from shrinking
	&.active {
		// Style when input is valid (canSend is true)
		opacity: 1;
		cursor: pointer; // Indicate clickable
	}
}

// --- Optional: Voice Input Styles ---
// .voice-input { ... }
// .voice-input.recording { ... }
</style>
