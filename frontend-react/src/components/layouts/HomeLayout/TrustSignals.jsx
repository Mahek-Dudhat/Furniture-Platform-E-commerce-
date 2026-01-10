import './TrustSignals.css'
import { FaAward, FaTools, FaLeaf, FaShieldAlt } from 'react-icons/fa'

function TrustSignals() {
  const features = [
    { icon: <FaAward />, title: 'Premium Quality Materials', text: 'Every piece is crafted from carefully selected, high-grade materials' },
    { icon: <FaTools />, title: 'Expert Craftsmanship', text: 'Built by experienced craftsmen who take pride in every detail' },
    { icon: <FaLeaf />, title: 'Sustainable Sourcing', text: 'We source responsibly to minimize environmental impact' },
    { icon: <FaShieldAlt />, title: '5 Year Warranty', text: 'All furniture comes with our comprehensive 5-year warranty' }
  ]

  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-section-header">
          <h1>Why Choose Us</h1>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="trust-card">
                <div className="trust-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSignals
