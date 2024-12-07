document.addEventListener("DOMContentLoaded", function() {
    const captureButton = document.getElementById("capture");
    const screenshotContainer = document.getElementById("screenshotContainer");

    // Function to save the screenshot to local storage
    function saveScreenshot(dataUrl) {
        chrome.storage.local.get(["screenshots"], function(result) {
            let screenshots = result.screenshots || [];
            screenshots.push(dataUrl); // Add the new screenshot
            chrome.storage.local.set({ screenshots: screenshots }); // Save it back to local storage
        });
        
        if (screenshots.length > 3) {
            screenshots.shift(); // Remove the oldest screenshot
        }
    }

    // Function to display all stored screenshots
    function displayScreenshots() {
        chrome.storage.local.get(["screenshots"], function(result) {
            let screenshots = result.screenshots || [];
            screenshots.forEach(function(screenshotDataUrl) {
                const screenshotImage = new Image();
                screenshotImage.src = screenshotDataUrl;
                screenshotContainer.appendChild(screenshotImage);
            });
        });
    }

    // Event listener to capture the screenshot
    captureButton.addEventListener("click", function() {
        chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
            const screenshotImage = new Image();
            screenshotImage.src = screenshotDataUrl;
            screenshotContainer.appendChild(screenshotImage); // Display the screenshot in the popup

            // Save the screenshot to storage
            saveScreenshot(screenshotDataUrl);
        });
    });

    // Display previously saved screenshots when the popup is opened
    displayScreenshots();
});

