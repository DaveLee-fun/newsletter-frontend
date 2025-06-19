// Newsletter Frontend - Main JavaScript
// Vanilla JS (ES6+) for form handling and API communication

// AI Pulse Newsletter - Main JavaScript
// FastAPI 백엔드와 통신하는 뉴스레터 구독 시스템

// Configuration - 배포 환경에 맞게 설정
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'  // 개발 환경
    : 'https://newsletter-backend-c42b.onrender.com';  // 프로덕션 환경 (실제 Render 배포 URL)

// DOM Elements - 실제 HTML ID와 일치하도록 수정
let subscriptionForm, emailInput, submitBtn, successMessage;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSubscribersCount();
});

/**
 * 앱 초기화
 */
function initializeApp() {
    // DOM 요소 선택
    subscriptionForm = document.getElementById('subscriptionForm');
    emailInput = document.getElementById('email');
    submitBtn = document.getElementById('submitBtn');
    successMessage = document.getElementById('successMessage');
    
    // DOM 요소 존재 확인
    if (!subscriptionForm || !emailInput || !submitBtn) {
        console.error('필수 DOM 요소를 찾을 수 없습니다.');
        return;
    }
    
    setupEventListeners();
    console.log('Newsletter Frontend 초기화 완료');
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 폼 제출 이벤트
    subscriptionForm.addEventListener('submit', handleFormSubmit);
    
    // 실시간 이메일 유효성 검사 + 메시지 숨김
    emailInput.addEventListener('input', function() {
        validateEmailInput();
        // 사용자가 입력을 시작하면 기존 메시지 숨김
        if (emailInput.value.trim().length > 0) {
            clearAllMessages();
        }
    });
}

/**
 * 이메일 입력 실시간 유효성 검사
 */
function validateEmailInput() {
    const email = emailInput.value.trim();
    const isValid = isValidEmail(email);
    
    if (email && !isValid) {
        emailInput.classList.add('border-red-500');
        emailInput.classList.remove('border-gray-300');
    } else {
        emailInput.classList.remove('border-red-500');
        emailInput.classList.add('border-gray-300');
    }
}

/**
 * 폼 제출 처리
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // 유효성 검사
    if (!email) {
        showErrorMessage('이메일을 입력해주세요.');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorMessage('올바른 이메일 주소를 입력해주세요.');
        emailInput.focus();
        return;
    }
    
    // 구독 처리
    await subscribeNewsletter(email);
}

/**
 * 뉴스레터 구독 API 호출
 */
async function subscribeNewsletter(email) {
    try {
        // 로딩 상태 표시
        setLoadingState(true);
        clearAllMessages();
        
        // API 호출 - 올바른 엔드포인트 사용
        const response = await fetch(`${API_BASE_URL}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                name: null,
                source: 'website'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // 성공 처리
            showSuccessMessage();
            resetForm();
            
            // 구독자 수 업데이트
            setTimeout(() => {
                loadSubscribersCount();
            }, 1000);
            
        } else {
            // 에러 처리 - 중복 이메일 특별 처리
            if (response.status === 409) {
                showDuplicateEmailMessage();
            } else {
                const errorMessage = data.detail || data.message || '구독 중 오류가 발생했습니다.';
                showErrorMessage(errorMessage);
            }
        }
        
    } catch (error) {
        console.error('구독 요청 오류:', error);
        
        // 네트워크 오류 등의 경우
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showErrorMessage('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } else {
            showErrorMessage('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    } finally {
        setLoadingState(false);
    }
}

/**
 * 로딩 상태 설정
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        // 버튼 내용 변경
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        }
        
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        submitBtn.disabled = false;
        // 버튼 내용 복원
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
        
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

/**
 * 성공 메시지 표시
 */
function showSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // 5초 후 자동 숨김
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 10000);
    }
}

/**
 * 에러 메시지 표시
 */
function showErrorMessage(message) {
    // 기존 메시지 제거
    clearAllMessages();
    
    // 새 에러 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message mt-4 p-4 bg-red-50 border border-red-200 rounded-lg';
    errorDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="text-red-800 text-sm">${message}</div>
        </div>
    `;
    
    // 폼 아래에 추가
    subscriptionForm.parentNode.insertBefore(errorDiv, subscriptionForm.nextSibling);
    
    // 에러 메시지로 스크롤
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 5초 후 자동 제거
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * 중복 이메일 전용 메시지 표시
 */
function showDuplicateEmailMessage() {
    // 기존 메시지 제거
    clearAllMessages();
    
    // 이미 구독 중임을 알리는 친화적인 메시지
    const infoDiv = document.createElement('div');
    infoDiv.className = 'duplicate-message mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg';
    infoDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
                <i class="fas fa-info-circle text-blue-500"></i>
            </div>
            <div class="text-blue-800">
                <div class="font-semibold text-sm">이미 구독하고 계십니다! 🎉</div>
                <div class="text-sm mt-1">
                    입력하신 이메일로 이미 뉴스레터를 구독하고 계세요. 
                    다음 뉴스레터를 기대해주세요!
                </div>
                <div class="flex items-center space-x-4 mt-3">
                    <button onclick="showManageOptions()" class="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                        구독 관리
                    </button>
                    <button onclick="clearAllMessages()" class="text-gray-600 hover:text-gray-800 text-sm">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 폼 아래에 추가
    subscriptionForm.parentNode.insertBefore(infoDiv, subscriptionForm.nextSibling);
    
    // 메시지로 스크롤
    infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 폼 초기화
    resetForm();
}

/**
 * 구독 관리 옵션 표시
 */
function showManageOptions() {
    // 기존 메시지 제거
    clearAllMessages();
    
    const manageDiv = document.createElement('div');
    manageDiv.className = 'manage-message mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg';
    manageDiv.innerHTML = `
        <div class="text-center">
            <div class="text-gray-800 font-semibold mb-3">구독 관리</div>
            <div class="space-y-2 text-sm text-gray-600">
                <p>• 구독 해지를 원하시면 받으신 뉴스레터 하단의 '구독 해지' 링크를 클릭해주세요</p>
                <p>• 이메일 주소 변경을 원하시면 기존 구독을 해지 후 새로 가입해주세요</p>
                <p>• 문의사항이 있으시면 답장으로 연락해주세요</p>
            </div>
            <button onclick="clearAllMessages()" class="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors">
                닫기
            </button>
        </div>
    `;
    
    subscriptionForm.parentNode.insertBefore(manageDiv, subscriptionForm.nextSibling);
    manageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 모든 메시지 제거
 */
function clearAllMessages() {
    const messages = document.querySelectorAll('.error-message, .duplicate-message, .manage-message');
    messages.forEach(msg => msg.remove());
    
    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}



/**
 * 폼 리셋
 */
function resetForm() {
    subscriptionForm.reset();
    emailInput.classList.remove('border-red-500');
    emailInput.classList.add('border-gray-300');
}

/**
 * 이메일 유효성 검사
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * 구독자 수 로드
 */
async function loadSubscribersCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/subscribers/count`);
        const data = await response.json();
        
        if (response.ok && data.active_subscribers !== undefined) {
            updateSubscriberCount(data.active_subscribers);
        }
    } catch (error) {
        console.error('구독자 수 로드 실패:', error);
        // 에러 시 기본값 유지
    }
}

/**
 * 구독자 수 업데이트
 */
function updateSubscriberCount(count) {
    // 네비게이션의 구독자 수 업데이트
    const subscriberCountElements = document.querySelectorAll('[data-subscriber-count]');
    subscriberCountElements.forEach(element => {
        element.textContent = `${count.toLocaleString()}+ 구독자`;
    });
    
    // 헤더의 구독자 수도 업데이트
    const headerCount = document.querySelector('.hidden.sm\\:flex span');
    if (headerCount) {
        headerCount.textContent = `${count.toLocaleString()}+ 구독자`;
    }
}

// Animation and UI Enhancement Functions
function showLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    button.disabled = true;
}

function hideLoading(button) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    if (btnText) btnText.classList.remove('hidden');
    if (btnLoading) btnLoading.classList.add('hidden');
    button.disabled = false;
}

function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    
    // Hide form
    subscriptionForm.style.display = 'none';
    
    // Animate success message
    setTimeout(() => {
        successMessage.style.transform = 'scale(1.02)';
        setTimeout(() => {
            successMessage.style.transform = 'scale(1)';
        }, 200);
    }, 100);
}

function showErrorMessage(message) {
    // Create error message element if it doesn't exist
    let errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'mt-6 bg-red-50 border border-red-200 rounded-lg p-4';
        errorMessage.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
                </div>
                <div>
                    <h3 class="text-red-800 font-semibold">구독 신청 중 오류가 발생했습니다</h3>
                    <p class="text-red-700 text-sm" id="errorText"></p>
                </div>
            </div>
        `;
        successMessage.parentNode.insertBefore(errorMessage, successMessage);
    }
    
    document.getElementById('errorText').textContent = message;
    errorMessage.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Newsletter subscription function
async function subscribeToNewsletter(email, name = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                name: name,
                source: 'website'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // API에서 반환한 오류 메시지 사용
            throw new Error(data.error || data.detail || '구독 신청 중 오류가 발생했습니다.');
        }

        return data;
    } catch (error) {
        console.error('Subscription error:', error);
        
        // 네트워크 오류 처리
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        }
        
        throw error;
    }
}

// Handle subscription form submission
async function handleSubscription(email, button) {
    if (!email) {
        showErrorMessage('이메일 주소를 입력해주세요.');
        return;
    }

    if (!isValidEmail(email)) {
        showErrorMessage('올바른 이메일 주소를 입력해주세요.');
        return;
    }

    try {
        showLoading(button);
        const result = await subscribeToNewsletter(email);
        
        if (result.success) {
            showSuccessMessage();
            
            // Analytics tracking (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscription', {
                    'event_category': 'engagement',
                    'event_label': 'newsletter',
                    'value': 1
                });
            }

            // Clear form
            if (emailInput) emailInput.value = '';
        } else {
            showErrorMessage(result.error || '구독 신청 중 오류가 발생했습니다.');
        }

    } catch (error) {
        let errorMessage = error.message || '구독 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        showErrorMessage(errorMessage);
    } finally {
        hideLoading(button);
    }
}

// Event Listeners
if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        await handleSubscription(email, submitBtn);
    });
}

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    const duration = 2000; // Animation duration in milliseconds
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const start = 0;
        const startTime = Date.now();
        
        function updateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            // Format number with commas if needed
            const formattedNumber = current.toLocaleString();
            
            // Preserve original suffix (like +, %)
            const originalText = counter.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            
            counter.textContent = formattedNumber + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        updateCounter();
    });
}

// Initialize animations when element comes into view
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-counter')) {
                    animateCounters();
                } else {
                    entry.target.classList.add('animate-fadeInUp');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.scroll-reveal, .stats-counter').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page became visible, resume animations if needed
        document.querySelectorAll('.animate-pulse').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    } else {
        // Page hidden, pause animations to save resources
        document.querySelectorAll('.animate-pulse').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
});

// Error handling for unhandled promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Export functions for potential external use
window.AINewsletterApp = {
    subscribeToNewsletter,
    isValidEmail,
    showSuccessMessage,
    showErrorMessage,
    loadSubscribersCount
}; 