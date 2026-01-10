import { useState } from 'react'
import './Newsletter.css'

function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setEmail('')
    }
  }

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <h2>SIGN UP TO GET 10% OFF YOUR FIRST ORDER AND STAY UP TO DATE ON THE LATEST PRODUCT RELEASES, SPECIAL OFFERS AND NEWS</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
