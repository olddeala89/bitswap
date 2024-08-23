document.addEventListener("DOMContentLoaded", function() {
    const select = document.getElementById("custom-select");
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "custom-options";

    Array.from(select.options).forEach(option => {
        const customOption = document.createElement("div");
        customOption.className = "custom-option";
        customOption.innerHTML = `<img src="${option.getAttribute('data-img')}" alt="${option.text}"> ${option.text}`;
        customOption.dataset.value = option.value;

        customOption.addEventListener("click", () => {
            select.value = customOption.dataset.value;
            optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            customOption.classList.add('selected');
        });

        optionsContainer.appendChild(customOption);
    });

    select.parentNode.appendChild(optionsContainer);
    
    // Select the first option by default
    optionsContainer.querySelector('.custom-option').classList.add('selected');

    // Hide original select element in non-mobile view
    if (window.innerWidth > 767) {
        select.style.display = 'none';
    }
    
    // Listen for window resize to toggle visibility
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 767) {
            select.style.display = 'inline-block';
            optionsContainer.style.display = 'none';
        } else {
            select.style.display = 'none';
            optionsContainer.style.display = 'block';
        }
    });
});