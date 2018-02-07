$('document').ready(function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzJb8ch1pg5vSCx8dAoTHEQwwn5SjfcGsWa7GpP4mb4-C20tq0G/exec'
    const form = document.forms['submit-to-google-sheet']
    console.log('HERE');
    form.addEventListener('submit', e => {
        e.preventDefault()
        fetch(scriptURL, {
                method: 'POST',
                body: new FormData(form)
            })
            .then(function(response) {
                console.log('Success!');
                window.location.replace("../formSubmitted");
            })
            .catch(error => console.error('Error!', error.message))
    })
});

function success(e) {
    console.log("success");
}