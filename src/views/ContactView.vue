<script setup>
import { ref } from 'vue'

const formRef = ref(null)

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const customerType = ref('Consumer')
const subject = ref('Customer Feedback')

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const companyName = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')
const message = ref('')
const newsletter = ref(false)

const customerTypes = [
  'Consumer',
  'Distributor',
  'Retail Store'
]

const subjects = [
  'Customer Feedback',
  'Sales - International',
  'Sales - USA'
]

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]

const resetForm = () => {
  customerType.value = 'Consumer'
  subject.value = 'Customer Feedback'

  firstName.value = ''
  lastName.value = ''
  email.value = ''
  companyName.value = ''
  address.value = ''
  city.value = ''
  state.value = ''
  zipCode.value = ''
  message.value = ''
  newsletter.value = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = ''

  try {
    const formData = new FormData(
      formRef.value
    )

    const body = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      body.append(
        key,
        value.toString()
      )
    }

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })

    if (!response.ok) {
      throw new Error(
        'Unable to submit contact form.'
      )
    }

    submitSuccess.value = true

    resetForm()

    window.scrollTo({
      top:
        formRef.value
          ?.getBoundingClientRect().top +
        window.scrollY -
        140,
      behavior: 'smooth'
    })
  } catch (error) {
    console.error(
      'Contact form submission failed:',
      error
    )

    submitError.value =
      'We were unable to send your message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="contact-form-section">
    <div class="contact-form-container">
      <div class="contact-heading">
        <span class="contact-eyebrow">
          GET IN TOUCH
        </span>

        <h1>
          Contact CandyRific
        </h1>

        <p>
          Have a question, comment, or sales inquiry?
          Send us a message and someone from our team
          will be in touch.
        </p>
      </div>

      <div
        v-if="submitSuccess"
        class="form-status form-status-success"
        role="status"
      >
        <div class="status-icon">
          ✓
        </div>

        <div>
          <h2>
            Message sent!
          </h2>

          <p>
            Thank you for contacting CandyRific.
            Your message has been received and someone
            from our team will be in contact with you.
          </p>
        </div>
      </div>

      <div
        v-if="submitError"
        class="form-status form-status-error"
        role="alert"
      >
        {{ submitError }}
      </div>

      <form
        ref="formRef"
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        class="contact-form"
        @submit.prevent="handleSubmit"
      >
        <input
          type="hidden"
          name="form-name"
          value="contact"
        />

        <p class="honeypot-field">
          <label>
            Do not fill this out if you are human:
            <input
              name="bot-field"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </label>
        </p>

        <div class="form-top-grid">
          <div class="form-group">
            <label for="customer-type">
              Select Which Describes You Best
            </label>

            <div class="select-wrapper">
              <select
                id="customer-type"
                v-model="customerType"
                name="customerType"
                required
              >
                <option
                  v-for="type in customerTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="subject">
              Subject
            </label>

            <div class="select-wrapper">
              <select
                id="subject"
                v-model="subject"
                name="contactSubject"
                required
              >
                <option
                  v-for="subjectOption in subjects"
                  :key="subjectOption"
                  :value="subjectOption"
                >
                  {{ subjectOption }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-main-grid">
          <div class="form-left">
            <div class="form-group">
              <label for="first-name">
                First Name
              </label>

              <input
                id="first-name"
                v-model="firstName"
                type="text"
                name="firstName"
                autocomplete="given-name"
                required
              />
            </div>

            <div class="form-group">
              <label for="last-name">
                Last Name
              </label>

              <input
                id="last-name"
                v-model="lastName"
                type="text"
                name="lastName"
                autocomplete="family-name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">
                Email
              </label>

              <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                required
              />
            </div>

            <div class="form-divider"></div>

            <div class="form-group">
              <label for="company-name">
                Company Name
              </label>

              <input
                id="company-name"
                v-model="companyName"
                type="text"
                name="companyName"
                autocomplete="organization"
              />
            </div>

            <div class="form-group">
              <label for="address">
                Address
                <span>
                  (If Consumer, use personal address)
                </span>
              </label>

              <input
                id="address"
                v-model="address"
                type="text"
                name="address"
                autocomplete="street-address"
              />
            </div>

            <div class="form-group">
              <label for="city">
                City
              </label>

              <input
                id="city"
                v-model="city"
                type="text"
                name="city"
                autocomplete="address-level2"
              />
            </div>

            <div class="state-zip-grid">
              <div class="form-group">
                <label for="state">
                  State
                </label>

                <div class="select-wrapper">
                  <select
                    id="state"
                    v-model="state"
                    name="state"
                    autocomplete="address-level1"
                  >
                    <option value="">
                      Choose...
                    </option>

                    <option
                      v-for="stateName in states"
                      :key="stateName"
                      :value="stateName"
                    >
                      {{ stateName }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="zip-code">
                  Zip Code
                </label>

                <input
                  id="zip-code"
                  v-model="zipCode"
                  type="text"
                  name="zipCode"
                  inputmode="numeric"
                  autocomplete="postal-code"
                  maxlength="10"
                />
              </div>
            </div>
          </div>

          <div class="form-right">
            <div class="form-group message-group">
              <label for="message">
                Message
              </label>

              <textarea
                id="message"
                v-model="message"
                name="message"
                required
              ></textarea>
            </div>

            <label
              class="newsletter-option"
              for="newsletter"
            >
              <input
                id="newsletter"
                v-model="newsletter"
                type="checkbox"
                name="newsletter"
                value="Yes"
              />

              <span class="custom-checkbox">
                <span>
                  ✓
                </span>
              </span>

              <span>
                I'd like to receive the
                CandyRific Newsletter.
              </span>
            </label>

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">
                Send Message
              </span>

              <span v-else>
                Sending...
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-form-section {
  width: 100%;
  padding: 70px 24px 90px;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #faf7fc 100%
    );
}

.contact-form-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.contact-heading {
  max-width: 700px;
  margin-bottom: 38px;
}

.contact-eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  color: #f04d86;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.contact-heading h1 {
  margin: 0 0 10px;
  color: #703795;
  font-size: clamp(
    2.2rem,
    4vw,
    3.4rem
  );
  font-weight: 700;
  line-height: 1;
}

.contact-heading p {
  margin: 0;
  color: #555;
  font-size: 1.05rem;
  line-height: 1.6;
}

.contact-form {
  padding: 36px;
  border: 1px solid #e7ddec;
  border-radius: 18px;
  background: #ffffff;
  box-shadow:
    0 12px 35px
    rgba(112, 55, 149, 0.09);
}

.form-top-grid,
.form-main-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 30px;
}

.form-top-grid {
  margin-bottom: 26px;
}

.form-main-grid {
  align-items: stretch;
}

.form-left,
.form-right {
  min-width: 0;
}

.form-right {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #333;
  font-size: 0.96rem;
  font-weight: 600;
}

.form-group label span {
  font-weight: 400;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #ddd6e2;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #333;
  font-family: inherit;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.form-group input,
.form-group select {
  height: 52px;
  padding: 0 15px;
}

.form-group textarea {
  min-height: 378px;
  padding: 14px 15px;
  resize: vertical;
  line-height: 1.5;
}

.form-group input:hover,
.form-group select:hover,
.form-group textarea:hover {
  border-color: #bda9c9;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #703795;
  box-shadow:
    0 0 0 4px
    rgba(112, 55, 149, 0.1);
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 18px;
  width: 10px;
  height: 10px;
  border-right: 3px solid #703795;
  border-bottom: 3px solid #703795;
  pointer-events: none;
  transform:
    translateY(-70%)
    rotate(45deg);
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 48px;
  color: #703795;
  cursor: pointer;
}

.form-divider {
  width: 100%;
  height: 1px;
  margin: 8px 0 28px;
  background: #e2dce5;
}

.state-zip-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);
  gap: 18px;
}

.message-group {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.message-group textarea {
  flex: 1;
}

.newsletter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 3px 0 28px;
  color: #444;
  font-size: 0.96rem;
  line-height: 1.4;
  cursor: pointer;
}

.newsletter-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.custom-checkbox {
  display: flex;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  border: 2px solid #b9adbF;
  border-radius: 4px;
  background: #fff;
  color: transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.newsletter-option
input:checked +
.custom-checkbox {
  border-color: #703795;
  background: #703795;
  color: #fff;
}

.newsletter-option
input:focus-visible +
.custom-checkbox {
  box-shadow:
    0 0 0 4px
    rgba(112, 55, 149, 0.15);
}

.submit-button {
  width: 100%;
  min-height: 62px;
  margin-top: auto;
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(
      90deg,
      #f04d86 0%,
      #d9166b 100%
    );
  color: #fff;
  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow:
    0 7px 18px
    rgba(240, 77, 134, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 24px
    rgba(240, 77, 134, 0.28);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.form-status {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  padding: 20px 22px;
  border-radius: 12px;
}

.form-status-success {
  border: 1px solid
    rgba(112, 55, 149, 0.2);
  background:
    rgba(112, 55, 149, 0.07);
  color: #46205f;
}

.form-status-success h2 {
  margin: 0 0 4px;
  color: #703795;
  font-size: 1.2rem;
}

.form-status-success p {
  margin: 0;
  line-height: 1.5;
}

.status-icon {
  display: flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #703795;
  color: #fff;
  font-weight: 700;
}

.form-status-error {
  border: 1px solid
    rgba(240, 77, 134, 0.3);
  background:
    rgba(240, 77, 134, 0.08);
  color: #9a244d;
}

.honeypot-field {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  white-space: nowrap !important;
}

@media (max-width: 850px) {
  .contact-form-section {
    padding:
      50px 18px
      70px;
  }

  .contact-form {
    padding: 26px 22px;
  }

  .form-top-grid,
  .form-main-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-top-grid {
    margin-bottom: 0;
  }

  .form-group textarea {
    min-height: 240px;
  }

  .form-right {
    margin-top: 2px;
  }

  .newsletter-option {
    margin-top: 0;
  }
}

@media (max-width: 520px) {
  .contact-form-section {
    padding:
      38px 14px
      55px;
  }

  .contact-form {
    padding: 22px 16px;
    border-radius: 12px;
  }

  .state-zip-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .contact-heading {
    margin-bottom: 26px;
  }

  .contact-heading p {
    font-size: 0.98rem;
  }

  .submit-button {
    min-height: 56px;
  }
}
</style>