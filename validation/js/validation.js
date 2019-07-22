// JavaScript validation of subscription form.
// A. Anonymous function triggered by submit event
// B. Functions called to perform generic checks by anon function in section A
// C. Functions called to perform generic checks by anon function in section A
// D. Functions to get / set / show / remove error messages
// E. Object to check type of data using RegEx called by validateTypes in section B

// Dependencies: jQuery, jQueryUI, birthday.js, styles.css

(function() {
  document.forms.register.noValidate = true; // DISABLE HTML5 VALIDATION


// A: ANONYMOUS FUNCTION TRIGGERED BY THE SUBMIT EVENT
  $('form').on('submit', function(e) {
    var elements = this.elements;
    var valid = {};
    var isValid;                    // CHECKS FORM CONTROLS
    var isFormValid;                // CHECKS ENTIRE FORM


// PERFORM GENERIC CHECKS (calls functions outside the event handler)
    var i;
    for (i = 0, l = elements.length; i < 1; i++) {
      // Next line calls validateRequired() validateTypes()
      isValid = validateRequired(elements[i]) && validateTypes(elements[i]);
      if (!isValid) {
        showErrorMessage(elements[i]);
      } else {
        removeErrorMessage(elements[i]);
      }
      valid[elements[i].id] = isValid;
    }


    // PERFORM CUSTON VALIDATION
    // BIO
    if (!validateBio()) {
      showErrorMessage(document.getElementById('bio'));
      valid.bio = false;
    } else {
      removeErrorMessage(document.getElementById('bio'));
    }

    if (!validatePassword()) {
      showErrorMessage(document.getElementById('password'));
      valid.password = false;
    } else {
      removeErrorMessage(document.getElementById('password'));
    }

    if (!validateParentsConsent()) {
      showErrorMessage(document.getElementById('parents-consent'));
      valid.parentsConsent = false;
    } else {
      removeErrorMessage(document.getElementById('parents-consent'));
    }


    // DID IT PASS / CAN IT SUBMIT THE FORM?
    // LOOP THROUGH VALID OBJECT, IF THERE ARE ERRORS SET isFormValid TO false
    for (var field in valid) {
      if (!valid[field]) {
        isFormValid = false;
        break;
      }
      isFormValid = true;
    }

    // IF THE FORM DID NOT VALIDATE, PREVENT IT FROM BEING SUBMITTED
    if (!isFormValid) {
      e.preventDefault();
    }
  });

  //END ANONYMOUS FUNCTION TRIGGERED BY THE SUBMIT BUTTON

  // B: FUNCTIONS FOR GENERIC CHECKS

  // CHECK IF THE FIELD IS REQUIRED AND IF SO DOES IT HAVE A VALUE
  // Relies on isRequired() and isEmpty() both shown below, and setErrorMessage - shown later
  function validateRequired(el) {
    if (isRequired(el)) {
      var valid = !isEmpty(el);
      if(!valid) {
        setErrorMessage(el, 'Field is required');
      }
      return valid;
    }
    return true;
  }

  // CHECK IF THE ELEMENT IS REQUIRED
  // IT IS CALLED BY validateRequired()
  function isRequired(el) {
    return ((typeof el.required === 'boolean') && el.required) ||
      (typeof el.required === 'string');
  }

  // CHECK IF THE ELEMENT IS EMPTY (or its value is the same as the placeholder text)
  // it is called by validateRequired()
  function isEmpty(el) {
    return !el.value || el.value === el.placeholder;
  }

  // CHECK IF THE VALUE FITS THE TYPE ATTRIBUTE
  // Relies on the validateType object
  function validateTypes(el) {
    if (!el.value) return true;

    var type = $(el).data('type') || el.getAttribute('type');
    if (typeof validateType[type] === 'function') {         // IS THE TYPE A METHOD OF VALIDATE OBJECT?
      return validateType[type](el);
    } else {
      return true;
    }
  }


  // C: FUNCTIONS FOR CUSTOM VALIDATION

  // IF USER IS UNDER 13, CHECK THAT PARENTS HAVE TICKED THE CONSENT CHECKBOX
  // Dependency: birthday.js (otherwise check does not work)
  function validateParentsConsent() {
    var parentsConsent   = document.getElementById('parents-consent');
    var consentContainer = document.getElementById('consent-container');
    var valid = true;                          // Variable: valid set to true
    if (consentContainer.className.indexOf('hide') === -1) { // If checkbox shown
      valid = parentsConsent.checked;          // Update valid: is it checked/not
      if (!valid) {                            // If not, set the error message
        setErrorMessage(parentsConsent, 'You need your parents\' consent');
      }
    }
    return valid;                               // Return whether valid or not
  }

  // CHECK IF THE BIO IS LESS THAN OR EQUAL TO 140 CHARACTERS
  function validateBio() {
    var bio = document.getElementById('bio');
    var valid = bio.value.length <= 140;
    if (!valid) {
      setErrorMessage(bio, 'Please make sure your bio does not exceed 140 characters');
    }
    return valid;
  }

  // CHECK THAT THE PASSWORDS BOTH MATCH AND ARE 8 CHARACTERS OR MORE
  function validatePassword() {
    var password = document.getElementById('password');
    var valid = password.value.length >= 8;
    if (!valid) {
      setErrorMessage(password, 'Please make sure your password has at least 8 characters');
    }
    return valid;
  }



  // D: FUNCTIONS SET / GET / SHOW / REMOVE ERROR MESSAGES


  function setErrorMessage(el, message) {
    $(el).data('errorMessage', message);
  }

  function getErrorMessage(el) {
    return $(el).data('errorMessage') || e.title;
  }

  function showErrorMessage(el) {
    var $el = $(el);
    var errorContainer = $el.siblings('.error.message');

    if (!errorContainer.length) {
      // create a span element to hold the error and add it after the element with the error
      errorContainer = $('<span class="error message"></span>').insertAfter($el);
    }
    errorContainer.text(getErrorMessage(el));
  }

  function removeErrorMessage(el) {
    var errorContainer = $(el).siblings('.error.message');
    errorContainer.remove();
  }



// E: OBJECT FOR CHECKING TYPES

// CHECKS WHETHER DATA IS VALID, IF NOT SET ERROR MESSAGE
// RETURNS TRUE IF VALID, FALSE IF INVALID
var validateType = {
    email: function (el) {                                 // Create email() method
      // Rudimentary regular expression that checks for a single @ in the email
      var valid = /[^@]+@[^@]+/.test(el.value);            // Store result of test in valid
      if (!valid) {                                        // If the value of valid is not true
        setErrorMessage(el, 'Please enter a valid email'); // Set error message
      }
      return valid;                                        // Return the valid variable
    },
    number: function (el) {                                // Create number() method
      var valid = /^\d+$/.test(el.value);                  // Store result of test in valid
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid number');
      }
      return valid;
    },
    date: function (el) {                                  // Create date() method
                                                           // Store result of test in valid
      var valid = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/.test(el.value);
      if (!valid) {                                        // If the value of valid is not true
        setErrorMessage(el, 'Please enter a valid date');  // Set error message
      }
      return valid;                                        // Return the valid variable
    }
  };

}());  // End of IIFE
