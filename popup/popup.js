const regex = /^https:\/\/.*\.salesforce\.com\/_ui\/common\/apex\/debug\/ApexCSIPage$/;

function filterRawLogs(string_to_filter) {

    const raw_logs_elements = document.querySelectorAll('[id^="textareafield-"][id$="-inputEl"]');

    if (raw_logs_elements) {

        const log_message = 
        'STRING TO FILTER NOT FOUND IN THIS LOG\n' + 
        '-'.repeat(38) +
        '\n'

        for (let e of raw_logs_elements) {
            if (e.value.includes(string_to_filter)) {

                e.value = e.value.split('\n')
                .filter(line => line.includes(string_to_filter))
                .join('\n\n')

            } else if (!e.value.includes(log_message)){

                e.value = log_message + e.value;

            }
        }

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
            }


        });

    });
});
