// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.consulting-form');
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');

    form.addEventListener('submit', function() {
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
    });

    // 전화번호 자동 포맷팅
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 3) {
            value = value.substring(0, 3) + '-' + value.substring(3);
        }
        if (value.length >= 8) {
            value = value.substring(0, 8) + '-' + value.substring(8, 12);
        }
        e.target.value = value;
    });

    // 글자 수 카운터
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        if (maxLength) {
            const counter = document.createElement('small');
            counter.className = 'text-muted float-end mt-1';
            counter.textContent = `0/${maxLength}`;
            
            textarea.addEventListener('input', function() {
                counter.textContent = `${this.value.length}/${maxLength}`;
            });
            
            textarea.parentNode.appendChild(counter);
        }
    });
});