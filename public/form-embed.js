(function() {
    // Initialize form
    function initForm() {
      const container = document.getElementById('survey-form');
      if (!container) return;
  
      const formId = container.getAttribute('data-form-id');
      if (!formId) return;
  
      // Load form data
      fetch(`/api/forms/${formId}`)
        .then(response => response.json())
        .then(data => {
          // Create form iframe
          const iframe = document.createElement('iframe');
          iframe.src = `/forms/${formId}${window.location.search}`; // Preserve query params
          iframe.style.width = '100%';
          iframe.style.height = '600px';
          iframe.style.border = 'none';
          iframe.style.overflow = 'hidden';
          
          // Add to container
          container.appendChild(iframe);
  
          // Handle iframe resizing
          window.addEventListener('message', (event) => {
            if (event.data.type === 'form-height') {
              iframe.style.height = `${event.data.height}px`;
            }
          });
        })
        .catch(error => {
          console.error('Failed to load form:', error);
          container.innerHTML = 'Failed to load form.';
        });
    }
  
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initForm);
    } else {
      initForm();
    }
  })();