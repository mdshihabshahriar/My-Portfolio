// contact.js
(function(){
    emailjs.init("bnk-z9XaXEkkqbPfY"); // EmailJS public key
})();

const form = document.getElementById('contact-form');
const output = document.getElementById('output_message');

form.addEventListener('submit', function(e){
    e.preventDefault();

    emailjs.sendForm('service_y9fdq0l', 'template_j9k05su', this)
    .then(function(){
        output.style.color = 'green';
        output.textContent = "Message Sent Successfully!";
        form.reset();
    }, function(error){
        output.style.color = 'red';
        output.textContent = "Failed to Send Message!";
        console.log('FAILED...', error);
    });
});
