document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById('generateUid');
  const copyBtn = document.getElementById('copyUid');
  const uidDisplay = document.getElementById('uidDisplay');
  const userForm = document.getElementById('userForm');

  // Generate UID Function with Validation
  generateBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();

      // Check if name and phone are filled
      if (!name || !phone) {
          alert('Please fill out your name and phone number before generating a UID.');
          return;
      }

      const uid = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // Generate 12-digit UID
      uidDisplay.textContent = `Your UID: ${uid}`;
      copyBtn.style.display = 'inline-block';

      // Store the generated UID in a hidden field
      const uidInput = document.getElementById('uid');
      if (uidInput) {
          uidInput.value = uid;
      } else {
          const newUidInput = document.createElement('input');
          newUidInput.type = 'hidden';
          newUidInput.id = 'uid';
          newUidInput.value = uid;
          userForm.appendChild(newUidInput);
      }
  });

  // Copy UID to Clipboard
  copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(uidDisplay.textContent.split(': ')[1]);
      alert('UID copied to clipboard!');
  });

  // Handle Form Submission
  userForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const uid = document.getElementById('uid') ? document.getElementById('uid').value : '';

      // Check if UID was generated
      if (!uid) {
          alert('Please generate a UID before submitting the form.');
          return;
      }

      // Check if the same name and phone already exist in SheetDB
      fetch('https://sheetdb.io/api/v1/vekd9eyhejzh3/search?name=' + name + '&phone=' + phone)
          .then(response => response.json())
          .then(data => {
              if (data.length > 0) {
                  alert('You have already submitted the form!');
              } else {
                  // Save to SheetDB if not found
                  const newEntry = {
                      "data": { "name": name, "phone": phone, "uid": uid }
                  };

                  fetch('https://sheetdb.io/api/v1/vekd9eyhejzh3', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newEntry)
                  }).then(response => {
                      if (response.ok) {
                          alert('Form successfully submitted!');
                          // Refresh the page after submission
                          window.location.reload();
                      } else {
                          alert('Error submitting form!');
                      }
                  });
              }
          });
  });
});
