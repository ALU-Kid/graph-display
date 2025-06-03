// public/js/main.js

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the pixel preview
  initPixelPreview();
  
  // Theme toggling
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const body = document.body;
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      
      if (newTheme === 'dark') {
        body.classList.add('bg-gray-900', 'text-white');
        body.classList.remove('bg-gray-50', 'text-gray-800');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
      } else {
        body.classList.remove('bg-gray-900', 'text-white');
        body.classList.add('bg-gray-50', 'text-gray-800');
        themeToggle.querySelector('i').classList.remove('fa-sun');
        themeToggle.querySelector('i').classList.add('fa-moon');
      }
      
      // Refresh the pixel preview with new theme
      updatePixelPreview();
    });
  }
  
  // Message queue interactions
  const addMessageBtn = document.getElementById('add-message');
  if (addMessageBtn) {
    addMessageBtn.addEventListener('click', function() {
      openAddModal();
    });
  }
  
  // Edit current message
  const editMessageBtn = document.getElementById('edit-message');
  if (editMessageBtn) {
    editMessageBtn.addEventListener('click', function() {
      const currentMessage = document.getElementById('current-message-text').textContent.trim();
      openEditModal(currentMessage);
    });
  }
  
  // Modal handlers
  document.getElementById('cancel-edit')?.addEventListener('click', closeEditModal);
  document.getElementById('save-edit')?.addEventListener('click', saveEditModal);
  document.getElementById('cancel-add')?.addEventListener('click', closeAddModal);
  document.getElementById('save-add')?.addEventListener('click', saveAddModal);
  
  // Edit queue items
  document.querySelectorAll('.edit-queue-item').forEach(button => {
    button.addEventListener('click', function() {
      const messageItem = this.closest('.message-item');
      const message = messageItem.dataset.message;
      openEditModal(message, messageItem);
    });
  });
  
  // Promote queue items (move to current)
  document.querySelectorAll('.promote-queue-item').forEach(button => {
    button.addEventListener('click', function() {
      const messageItem = this.closest('.message-item');
      const message = messageItem.dataset.message;
      promoteMessage(message);
    });
  });
  
  // Rotation controls
  document.getElementById('next-message')?.addEventListener('click', rotateMessages);
  document.getElementById('refresh-message')?.addEventListener('click', refreshCurrentMessage);
  
  // Preview settings changes
  document.getElementById('font-style')?.addEventListener('change', updatePixelPreview);

  // Automatically rotate messages every 5 seconds
  setInterval(function() {
    fetch('/api/rotate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success && data.current) {
        document.getElementById('current-message-text').textContent = data.current;
        updatePixelPreview(data.current);
      }
    })
    .catch(function(err) {
      console.error('Auto rotate error:', err);
    });
  }, 5000);
});

// Pixel preview initialization
function initPixelPreview() {
  const currentMessage = document.getElementById('current-message-text')?.textContent.trim();
  if (currentMessage && currentMessage !== 'No active message') {
    updatePixelPreview(currentMessage);
  }
}

// Update the pixel preview
function updatePixelPreview(message) {
  const currentMessage = message || document.getElementById('current-message-text')?.textContent.trim();
  if (!currentMessage || currentMessage === 'No active message') {
    document.getElementById('preview-placeholder').classList.remove('hidden');
    document.getElementById('preview-canvas').classList.add('hidden');
    return;
  }
  
  const fontStyle = document.getElementById('font-style')?.value || 'pixel';
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  
  // Show loading state
  document.getElementById('preview-placeholder').classList.remove('hidden');
  document.getElementById('preview-canvas').classList.add('hidden');
  
  // Get the preview from server
  fetch('/api/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: currentMessage,
      fontStyle: fontStyle,
      darkMode: isDarkMode
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      renderPixelPreview(currentMessage, fontStyle, isDarkMode);
    }
  })
  .catch(error => {
    console.error('Error getting preview:', error);
  });
}

// Render the pixel preview on the canvas
function renderPixelPreview(message, fontStyle, darkMode) {
  // This would normally call to your pixel rendering code
  // For now, let's simulate with simple canvas drawing
  
  const canvas = document.getElementById('preview-canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('pixel-preview');

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(canvas);
  
  // Set canvas size based on container
  canvas.width = container.clientWidth - 40; // Subtract padding
  canvas.height = container.clientHeight - 40;
  
  // Colors for GitHub-style contributions
  const colors = darkMode 
    ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] // Dark mode
    : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']; // Light mode
    
  // Clear canvas
  ctx.fillStyle = darkMode ? '#0d1117' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Sample pixel data - in a real implementation, this would be generated
  // from your message conversion algorithm
  const weeks = 52;
  const daysPerWeek = 7;
  const cellSize = Math.min(
    Math.floor(canvas.width / weeks) - 1,
    Math.floor(canvas.height / daysPerWeek) - 1
  );
  const cellGap = 1;
  
  // Simple algorithm to generate a pattern based on the message
  // This is just a placeholder - you'd use your actual algorithm
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < daysPerWeek; day++) {
      // Simple hash of the characters in the message
      const charCode = (week + day) % message.length;
      const intensity = (message.charCodeAt(charCode) % 5);
      
      ctx.fillStyle = colors[intensity];
      ctx.fillRect(
        week * (cellSize + cellGap) + cellGap,
        day * (cellSize + cellGap) + cellGap,
        cellSize,
        cellSize
      );
    }
  }
  
  // Hide placeholder, show canvas
  document.getElementById('preview-placeholder').classList.add('hidden');
  document.getElementById('preview-canvas').classList.remove('hidden');
}

// Modal functions
function openEditModal(message, messageItem) {
  const modal = document.getElementById('edit-modal');
  const input = document.getElementById('edit-message-input');
  
  input.value = message;
  modal.classList.remove('hidden');
  
  // Store the message item if we're editing a queue item
  if (messageItem) {
    modal.dataset.messageItem = messageItem.dataset.message;
  } else {
    delete modal.dataset.messageItem;
  }
  
  input.focus();
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

function saveEditModal() {
  const modal = document.getElementById('edit-modal');
  const input = document.getElementById('edit-message-input');
  const newMessage = input.value.trim();
  
  if (newMessage === '') {
    alert('Message cannot be empty');
    return;
  }
  
  if (newMessage.length > 30) {
    alert('Message must be 30 characters or less');
    return;
  }
  
  // Check if we're editing a queue item or the current message
  if (modal.dataset.messageItem) {
    // Editing queue item - would update on server in real implementation
    alert(`Would update queue item: ${modal.dataset.messageItem} to ${newMessage}`);
  } else {
    // Editing current message
    document.getElementById('current-message-text').textContent = newMessage;
    updatePixelPreview(newMessage);
  }
  
  closeEditModal();
}

function openAddModal() {
  const modal = document.getElementById('add-modal');
  const input = document.getElementById('add-message-input');
  
  input.value = '';
  modal.classList.remove('hidden');
  input.focus();
}

function closeAddModal() {
  document.getElementById('add-modal').classList.add('hidden');
}

function saveAddModal() {
  const input = document.getElementById('add-message-input');
  const newMessage = input.value.trim();
  
  if (newMessage === '') {
    alert('Message cannot be empty');
    return;
  }
  
  if (newMessage.length > 30) {
    alert('Message must be 30 characters or less');
    return;
  }
  
  // Add to queue - would send to server in real implementation
  fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: newMessage
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Refresh the page to update the queue display
      window.location.reload();
    }
  })
  .catch(error => {
    console.error('Error adding message:', error);
  });
  
  closeAddModal();
}

function rotateMessages() {
  fetch('/api/rotate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Refresh the page to update everything
      window.location.reload();
    }
  })
  .catch(error => {
    console.error('Error rotating messages:', error);
  });
}

function refreshCurrentMessage() {
  // This would force a refresh of the current message display
  // and re-commit the current message pattern
  alert('Would refresh current message and re-commit pattern');
}

function promoteMessage(message) {
  // This would promote a queue message to be the current message
  alert(`Would promote message: ${message} to current`);
}