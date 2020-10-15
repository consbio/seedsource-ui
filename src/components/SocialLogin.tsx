import React from 'react'
import facebook from '../../images/facebook.png'
import twitter from '../../images/twitter.png'
import google from '../../images/google.png'

const SocialLogin = () => (
  <div>
    <div className="title has-text-centered has-text-grey is-7">Or sign in with:</div>
    <div className="has-text-centered">
      <a href="/accounts/login/google-oauth2/">
        <img src={google} alt="Login using a Google account" />
      </a>
      <a href="/accounts/login/facebook/" className="margin-left-5 margin-right-5">
        <img src={facebook} alt="Login using a Facebook account" />
      </a>
      <a href="/accounts/login/twitter/">
        <img src={twitter} alt="Login using a Twitter account" />
      </a>
    </div>
  </div>
)

export default SocialLogin
