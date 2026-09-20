export default function PricingPage() {
  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      
      <div className="pricing-plans">
        <div className="plan-card">
          <h2>Free</h2>
          <p className="price">$0/month</p>
          <ul>
            <li>10 AI generations/month</li>
            <li>5 scheduled posts</li>
            <li>1 connected account</li>
          </ul>
        </div>
        
        <div className="plan-card featured">
          <h2>Pro</h2>
          <p className="price">$29/month</p>
          <ul>
            <li>100 AI generations/month</li>
            <li>50 scheduled posts</li>
            <li>3 connected accounts</li>
          </ul>
        </div>
        
        <div className="plan-card">
          <h2>Business</h2>
          <p className="price">$99/month</p>
          <ul>
            <li>1000 AI generations/month</li>
            <li>500 scheduled posts</li>
            <li>10 connected accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
