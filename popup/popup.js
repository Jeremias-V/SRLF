const regex = /^https:\/\/.*\.salesforce\.com\/_ui\/common\/apex\/debug\/ApexCSIPage$/;

function filterRawLogs(string_to_filter, pretty = false) {

    const raw_logs_elements = document.querySelectorAll('[id^="textareafield-"][id$="-inputEl"]');

    if (raw_logs_elements && raw_logs_elements.length > 0) {

        const log_message = 
        'STRING TO FILTER NOT FOUND IN THIS LOG\n' + 
        '-'.repeat(38) +
        '\n'

        for (let e of raw_logs_elements) {
            if (e.value.includes(string_to_filter)) {

                e.value = e.value.split('\n')
                .filter(line => line.includes(string_to_filter))
                .join('\n\n')

                if (pretty) {
                    // FIXME: not working with lists and sets that have more than 1 item

                    // Split the value into lines
                    const lines = e.value.split('\n');
                    const jsonMatches = [];

                    // Apply regex to each line
                    for (let line of lines) {
                        const match = line.match(/{.*}/);
                        if (match) {
                            jsonMatches.push(match[0]);
                        }
                    }

                    // Process each matched JSON object
                    for (let jsonString of jsonMatches) {
                        try {
                            const jsonObject = JSON.parse(jsonString);
                            // Replace the JSON object in the string
                            e.value = e.value.replace(jsonString, `\n` + JSON.stringify(jsonObject, null, 2));
                        } catch (error) {
                            console.error("Invalid JSON string", error);
                        }
                    }
                }

            } else if (!e.value.includes(log_message)){

                e.value = log_message + e.value;

            }
        }

    } else {

        alert('No open raw logs found.');

    }

}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('filter-logs-button').addEventListener('click', function() {

        // Get the active tab in the current window
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {

            if(regex.test(tabs[0].url)){
                
                // Execute the content script to filter the raw logs on the active tab
                chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id
                    },
                    args: [document.getElementById('filter-string').value], // Pass the value to the function as an argument
                    function: filterRawLogs
                });
            } else {

                alert("You can only use this at the Apex Developer Console!");

            }

        });

    });

    document.getElementById('pretty-filter-logs-button').addEventListener('click', function() {

        // Get the active tab in the current window
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {

            if(regex.test(tabs[0].url)){
                
                // Execute the content script to filter the raw logs on the active tab
                chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id
                    },
                    args: [document.getElementById('filter-string').value, true], // Pass the value to the function as an argument
                    function: filterRawLogs
                });
            } else {

                alert("You can only use this at the Apex Developer Console!");

            }

        });

    });
});
