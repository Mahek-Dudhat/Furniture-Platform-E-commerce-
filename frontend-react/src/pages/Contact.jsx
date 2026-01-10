import './Contact.css'
import { MailCheck, MapPinnedIcon, MessageCircleMoreIcon, PhoneCallIcon } from 'lucide-react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';

function Contact() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Select Subject',
    message: '',

  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter a phone number';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.subject == "Select Subject") {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Please enter a message with at least 10 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Select Subject',
        message: '',
      });

      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);

  }

  return (
    <div className='contact-page container'>
      <div className="contact-hero">
        <h1 className='text-center'>Get In Touch</h1>
        <p className='text-center'>We'd love to hear from you. Our team is here to help.</p>
      </div>

      <div className="contact-container">
        <div className="row gx-5">
          <div className="col-12 col-md-4">
            <div className="contact-info">
              <div className="info-card">
                <span className='info-icon'><MapPinnedIcon aria-label='Visit Us' aria-hidden='true' /></span>
                <h3>Visit Us</h3>
                <p>123 Savaliya Circle,Yogichowk<br />Surat, Gujarat.</p>
              </div>

              <div className="info-card">
                <span className="info-icon"><PhoneCallIcon aria-label='Call Us' aria-hidden='true' /></span>
                <h3>Call Us</h3>
                <p>000000000000</p>
              </div>

              <div className="info-card">
                <span className="info-icon"><MailCheck aria-label='Email Us' aria-hidden='true' /></span>
                <h3>Email Us</h3>
                <p>XXXXXXXXXXXXXXXXXXXX</p>
              </div>

              <div className="info-card">
                <div className="info-icon"><MessageCircleMoreIcon aria-label='Live Chat' aria-hidden='true' /></div>
                <h3>Live Chat</h3>
                <p>Available on our website<br />Mon-Sat: 9:00 AM - 7:00 PM<br />Instant responses</p>
              </div>
            </div>
          </div>

          <div className="col-md-8 col-sm-12 p-sm-2">
            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible.</p>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group w-100">
                  <label htmlFor='name'>Full Name *</label>
                  <TextField
                    type='text'
                    id='name'
                    name='name'
                    placeholder='John Doe'
                    fullWidth
                    label="name"
                    color='black'
                    className={errors.name ? 'error' : ''}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="error-message">{errors.name}</p>}
                </div>


                <div className="row mt-4 w-100">
                  <div className="form-group col-6">
                    <label htmlFor='email'>Email Address *</label>
                    <TextField
                      type='email'
                      id='email'
                      name='email'
                      placeholder='jhon@example.com'
                      fullWidth
                      label="email"
                      color='black'
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>

                  <div className="form-group  col-6">
                    <label htmlFor='phone'>Phone Number</label>
                    <TextField
                      id='phone'
                      name='phone'
                      placeholder='(123) 456-7890'
                      fullWidth
                      label="phone"
                      color='black'
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                  </div>

                </div>

                <div className="form-group w-100 mt-4">
                  <InputLabel id="subject">Subject *</InputLabel>
                  <Select
                  fullWidth
                    labelId="subject"
                    id="subject"
                    name='subject'
                    label="subject"
                    value={formData.subject}
                    className={errors.subject ? 'error' : ''}
                    color='black'
                    onChange={handleChange}

                  >
                    <MenuItem value="Select Subject">Select subject</MenuItem>
                    <MenuItem value="product-inquiry">Product Inquiry</MenuItem>
                    <MenuItem value="order-status">Order Status</MenuItem>
                    <MenuItem value="sales-offers">Sales & Offers</MenuItem>
                    <MenuItem value="custom-order">Custom Order Request</MenuItem>
                    <MenuItem value="delivery">Delivery & Shipping</MenuItem>
                    <MenuItem value="return-exchange">Return & Exchange</MenuItem>
                    <MenuItem value="complaint">Complaint</MenuItem>
                    <MenuItem value="feedback">Feedback & Suggestions</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>

                  {errors.subject && <p className="error-message">{errors.subject}</p>}
                </div>


                <div className="form-group w-100 mt-4">
                  <label htmlFor='message'>Message *</label>
                  <textarea id='message' className={errors.message ? 'error' : ''} name='message' value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry..."
                    rows="6">

                  </textarea>
                  {errors.message && <p className="error-message">{errors.message}</p>}
                </div>

                <button type="submit" className="submit-btn mt-3 h" disabled={isSubmitting}>{isSubmitting ? "Sending.." : "Send Message"}</button>
              </form>
            </div>
          </div>

          <div className="map-section mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.082177513865436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Our Location"
            />
          </div>
        </div>
      </div>


    </div>
  )
}

export default Contact
