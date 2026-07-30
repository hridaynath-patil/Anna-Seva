'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header & Nav
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      available_food: 'AVAILABLE FOOD LIST',
      donate: 'DONATE',
      contact: 'CONTACT',
      donor: 'DONOR',
      admin: 'ADMIN',
      dashboard: 'DASHBOARD',
      language: 'Language',
      select_language: 'Select Language',
      english: 'English',
      hindi: 'हिंदी (Hindi)',
      marathi: 'मराठी (Marathi)'
    },
    // Homepage
    home: {
      trust_badge_mr: 'श्री. विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट उपक्रम',
      trust_badge_en: 'SHRI VISHWANATHRAO SHAMRAO PATIL CHARITABLE TRUST INITIATIVE',
      hero_title_1: 'Empowering Communities.',
      hero_title_2: 'Reducing Food Waste.',
      hero_desc: 'We bridge the gap between food abundance and hunger. Through local action and trusted coordination, we redirect surplus meals to families and shelters who need them most.',
      req_food_btn: 'Request Food Assistance',
      become_donor_btn: 'Become a Verified Donor',

      commitment_title: 'Our Commitment to Social Welfare',
      commitment_1_title: 'Coordinated Food Rescue Network',
      commitment_1_desc: 'Operated under the patronage of the Shri Vishwanathrao Shamrao Patil Charitable Trust.',
      commitment_2_title: 'Collaborative Local Alliances',
      commitment_2_desc: 'Partnering directly with Restaurants and local volunteers to map and verify surplus food availability.',
      commitment_3_title: 'Wide-Reaching Food Distribution',
      commitment_3_desc: 'Delivering fresh, quality-checked meals to families, orphanages, homes across Maharashtra.',
      commitment_4_title: 'Direct & Transparent Impact',
      commitment_4_desc: 'Enabling real-time request tracking and direct coordination between verified donors and organizations for total accountability.',

      impact_tag: 'TRACKING REAL CHANGE',
      impact_title: 'Our Impact Dashboard',
      active_donors: 'Active Donors',
      active_donors_desc: 'Sponsors backing our distribution',
      food_listed: 'Food Batches Listed',
      food_listed_desc: 'Total surplus allocations cataloged',
      fulfillments: 'Fulfillments Handled',
      fulfillments_desc: 'Direct deliveries successfully completed',

      pillars_tag: 'HOW WE COORDINATE',
      pillars_title: 'Operating Pillars',
      pillar_1_title: 'List Surplus Food',
      pillar_1_desc: 'Registered donors specify the type of food, quantity (number of plates), collection location, and contact mobile. The listing instantly displays on the public directory.',
      pillar_1_link: 'Donor Login →',
      pillar_2_title: 'Request & Collect',
      pillar_2_desc: 'NGOs, shelter homes, and volunteers filter listed food by state and city. They submit claims specifying the quantity, purpose, and delivery address.',
      pillar_2_link: 'Browse Food List →',
      pillar_3_title: 'Audit & Monitor',
      pillar_3_desc: 'System administrators manage regional coverage (states/cities), monitor donor enrollments, approve claims where needed, and compile performance audit reports.',
      pillar_3_link: 'Admin Portal →',

      trust_cta_title: 'Help Us Prevent Hunger',
      trust_cta_desc: 'Whether you represent a banquet hall with surplus catering or an NGO looking for support, Anna Seva provides a modern, direct, and verified platform to coordinate logistics and distribute fresh meals.',
      donate_now: '💝 Donate Now',
      reg_as_donor: 'Register as Donor',
      contact_office: 'Contact Trust Office'
    },
    // Media spotlight
    media: {
      tag: 'MEDIA SPOTLIGHT & COVERAGE',
      title: 'अन्न सेवा वृत्तपत्र प्रसिद्धी',
      desc: 'See what leading newspapers say about our efforts to reduce food waste and coordinate deliveries to feed the needy across Latur and Marathwada.',
      zoom_badge: '🔍 Click to Zoom / Read',
      view_clip_btn: '📰 View Full Newspaper Clip'
    },
    // About page
    about: {
      title: 'About Anna Seva',
      mission_title: 'Our Mission',
      default_mission: 'Anna Seva (अन्न सेवा) is a dedicated social welfare initiative established under the Shri Vishwanathrao Shamrao Patil Charitable Trust, Latur. Our core mission is to eliminate hunger and minimize food waste by creating a streamlined, transparent network connecting surplus food donors with verified non-profit organizations, shelters, and community kitchens across Maharashtra.',
      values_title: 'Core Value Propositions',
      val_1_title: 'Zero Waste:',
      val_1_desc: 'Ensuring surplus food goes to stomachs, not landfills.',
      val_2_title: 'Safety First:',
      val_2_desc: 'Connecting verified donors who maintain food quality standards.',
      val_3_title: 'Localized Impact:',
      val_3_desc: 'Filtering requests by State and City to optimize delivery ranges.',
      val_4_title: 'Direct Approvals:',
      val_4_desc: 'Donors maintain full control over who receives their listed food.',

      trustee_name: 'Shri. Hridaynath Bhagwat Patil',
      trustee_role: 'Founding President',
      trustee_org: 'Founding President at Shri. Vishwanathrao Shamrao Patil Trust, Latur',
      trustee_job: 'Software Developer at zCon Solutions Pvt. Ltd, Kothrud',
      trustee_edu: "B.Tech CSE'25 Graduate from Vellore Institute of Technology"
    },
    // Available food page
    food: {
      network_tag: 'SURPLUS DISTRIBUTION NETWORK',
      title: 'Available Food Directory',
      subtitle: 'Browse the active list of surplus food batches listed by verified donors. NGOs, community kitchens, and coordinators can submit direct claim requests for distribution.',
      search_keywords: 'Search Keywords',
      search_placeholder: 'e.g. Rice, Dal, Chapati...',
      state: 'State',
      all_states: 'All States',
      city: 'City',
      all_cities: 'All Cities',
      filter_btn: 'Filter',
      reset_btn: 'Reset',
      loading: 'Loading food catalog...',
      empty_title: 'No matching food items.',
      empty_desc: 'Try resetting the search filters or check back later.',

      col_sno: 'S.NO',
      col_contact: 'Contact',
      col_food_desc: 'Food Description',
      col_address: 'Collection Address',
      col_location: 'Location',
      col_status: 'Status',
      col_date: 'Date Cataloged',
      col_action: 'Action',

      status_approved: 'Request Approved',
      status_completed: 'Request Completed',
      status_available: 'Available',
      btn_claimed: 'Claimed',
      btn_completed: 'Completed',
      btn_claim_food: 'Claim Food',

      // Modal
      modal_title: 'Food Package Claims',
      modal_food_items: 'Food Items:',
      modal_contact_donor: 'Contact Donor:',
      modal_phone: 'Phone Number:',
      modal_location: 'Location:',
      modal_address: 'Address:',
      modal_info: 'Additional Info:',
      modal_listed_on: 'Listed On:',
      modal_sub_title: 'Submit Allocation Request',
      modal_ngo_label: 'NGO / Recipient Organization Name',
      modal_ngo_placeholder: 'e.g. V.S. Patil Charitable Trust',
      modal_mobile_label: 'Recipient Mobile Number',
      modal_mobile_placeholder: '10-digit mobile',
      modal_select_state: 'Select State',
      modal_select_city: 'Select City',
      modal_delivery_label: 'Delivery/Drop-off Address',
      modal_delivery_placeholder: 'Address details for collection',
      modal_reason_label: 'Claim Justification / Reason',
      modal_reason_placeholder: 'e.g. Free dinner feeding drive in local slum',
      modal_qty_label: 'Quantity Requested',
      modal_qty_placeholder: 'e.g. 20 packs',
      modal_submitting: 'Submitting Allocation Request...',
      modal_confirm_btn: 'Confirm Allocation Claim'
    },
    // Donate page
    donate: {
      tax_badge: 'TAX EXEMPT UNDER SECTION 80G',
      hero_title: 'Donate Now & Make a Difference',
      hero_desc: 'Your generous contribution helps us feed the hungry and reduce food waste across Maharashtra. Every rupee counts.',
      card_title: '💝 Make a Donation',
      select_amount: 'Select Amount (₹)',
      custom_amount_label: 'Or enter a custom amount',
      custom_amount_placeholder: 'Enter amount',
      name_label: 'Full Name *',
      name_placeholder: 'Enter your full name',
      email_label: 'Email Address *',
      email_placeholder: 'your@email.com',
      mobile_label: 'Mobile Number *',
      mobile_placeholder: '10-digit mobile',
      pan_label: 'PAN Number',
      pan_sub: '(for 80G receipt)',
      pan_placeholder: 'ABCDE1234F',
      summary_label: 'Donation Amount',
      submit_btn: '🙏 Donate with Razorpay',
      processing: 'Processing...',
      razorpay_note: 'Secured by Razorpay · UPI, Cards, Net Banking accepted',

      trust_card_title: 'Trust Details',
      trust_name_label: 'Name of Trust',
      trust_name_val: 'SHRI VISHWANATHRAO SHAMRAO PATIL CHARITABLE TRUST',
      trust_address_label: 'Address',
      trust_address_val: 'Hridaynath Bhagwat Patil, A1 Matoshree Empire, Latur',
      pan_code_label: 'PAN',
      urn_code_label: '80G URN',
      validity_label: 'Approval Valid',
      validity_val: 'AY 2026-27 to AY 2028-2029',

      bank_card_title: 'Bank Transfer Details',
      acc_name_label: 'Account Name',
      acc_name_val: 'SHRI VISHWANATHRAO SHAMRAO PATIL CH. TRUST',
      acc_no_label: 'Account No.',
      acc_no_val: '000100780002245',
      ifsc_label: 'IFSC Code',
      ifsc_val: 'HDFC0YNSBL',
      qr_scan_label: 'Scan with PhonePe',
      bank_transfer_note: 'ℹ️ For bank transfers, please email the transaction receipt to vspatil.charitabletrust@gmail.com to receive your 80G certificate.',

      tax_box_title: '🧾 80G Tax Deduction',
      tax_box_desc: 'This donation is eligible for deduction under Section 80G of the Income-tax Act, 1961.',
      tax_point_1: 'Legal compliance ref: 12-Sub-clause (A) of clause (iv) of first proviso to section 80G(5)',
      tax_point_2: 'Approved by the Principal Commissioner of Income Tax',

      how_title: 'How It Works',
      step_1: 'Select or enter your donation amount',
      step_2: 'Fill in your details for the 80G receipt',
      step_3: 'Pay securely via Razorpay (UPI/Card/NetBanking)',
      step_4: 'Receive your donation receipt & 80G certificate',

      receipt_success_title: 'Donation Successful!',
      receipt_thank: 'Thank you for your generosity,',
      receipt_amount: 'Amount',
      receipt_date: 'Date',
      receipt_payment_id: 'Payment ID',
      receipt_order_id: 'Order ID',
      receipt_footer_note: 'A formal 80G receipt will be sent to your email.'
    },
    // Contact page
    contact: {
      title: 'Contact Us',
      desc_default: 'Feel free to contact us with any questions, partnership proposals, or logistics issues. Fill out the form or write to us directly.',
      email_title: 'Email Address',
      email_val: 'vspatil.charitabletrust@gmail.com',
      helpline_title: 'Helpline Number',
      helpline_val: '+91 1800-111-222',
      office_title: 'Central Office',
      office_val: 'Matoshree Empire, Latur, Maharashtra, India',

      form_title: 'Send Message',
      name_label: 'Full Name',
      name_placeholder: 'Enter your name',
      email_label: 'Email Address',
      email_placeholder: 'Enter your email',
      mobile_label: 'Mobile Number',
      mobile_placeholder: 'Enter 10-digit mobile',
      message_label: 'Your Message',
      message_placeholder: 'Write your enquiry message here...',
      submitting: 'Sending...',
      submit_btn: 'Submit Enquiry'
    },
    // Donor Auth
    donor_auth: {
      login_title: 'Donor Login',
      email_label: 'Email Address',
      email_placeholder: 'e.g. patil@donor.com',
      password_label: 'Password',
      password_placeholder: 'Enter password',
      show: 'Show',
      hide: 'Hide',
      forgot_password: 'Forgot Password?',
      logging_in: 'Logging in...',
      login_btn: 'Login',
      admin_portal_btn: 'Admin Portal Login',
      no_account: "Don't have an account?",
      register_here: 'Register here',

      register_title: 'Donor Registration',
      name_label: 'Full Name',
      name_placeholder: 'Enter name',
      mobile_label: 'Mobile Number',
      mobile_placeholder: '10-digit mobile',
      state_label: 'State',
      select_state: 'Select State',
      city_label: 'City',
      select_city: 'Select City',
      address_label: 'Address',
      address_placeholder: 'e.g. b755 kolhapur',
      submitting: 'Submitting...',
      register_btn: 'Sent for Approval for Registration',
      already_account: 'Already have an account?',

      reg_submitted_title: 'Registration Submitted!',
      reg_submitted_desc: 'Thank you for registering as a food donor with Anna Seva (अन्न सेवा). Your registration has been submitted for administrator approval. Once approved, you will receive confirmation and will be able to log in to post food listings.',
      go_home: 'Go to Home',
      go_login: 'Login Page'
    },
    // Admin Auth
    admin_auth: {
      login_title: 'Admin Portal',
      email_label: 'Admin Email',
      email_placeholder: 'e.g. admin@annaseva.org',
      password_label: 'Password',
      password_placeholder: 'Enter password',
      authenticating: 'Authenticating...',
      access_btn: 'Access Dashboard'
    },
    // Forgot / Reset Password
    password_reset: {
      forgot_title: 'Forgot Password',
      forgot_desc: 'Enter your registered email address. We will generate a secure password reset link for your account.',
      email_placeholder: 'e.g. hriday@donor.com',
      requesting: 'Requesting Reset...',
      send_link_btn: 'Send Reset Link',
      remember_password: 'Remember your password?',
      back_to_login: 'Back to Login',

      reset_title: 'Reset Password',
      reset_desc: 'Please enter your new password below.',
      new_password_label: 'New Password',
      new_password_placeholder: 'Min 6 characters',
      confirm_password_label: 'Confirm Password',
      confirm_password_placeholder: 'Confirm your password',
      updating: 'Updating Password...',
      reset_btn: 'Reset Password',
      invalid_link_title: 'Invalid Reset Link',
      invalid_link_desc: 'No reset token was found in the link. Please request a new password reset link.',
      request_new_link: 'Request New Link'
    },
    // Footer
    footer: {
      trust_title: 'Shri Vishwanathrao Shamrao Patil Charitable Trust, Latur',
      rights: '© 2026 Anna Seva. All rights reserved. Connecting Donors & Feeding the Needy.'
    }
  },

  hi: {
    nav: {
      home: 'मुख्य पृष्ठ',
      about: 'हमारे बारे में',
      available_food: 'उपलब्ध भोजन सूची',
      donate: 'दान करें',
      contact: 'संपर्क',
      donor: 'दाता',
      admin: 'एडमिन',
      dashboard: 'डैशबोर्ड',
      language: 'भाषा',
      select_language: 'भाषा चुनें',
      english: 'English',
      hindi: 'हिंदी (Hindi)',
      marathi: 'मराठी (Marathi)'
    },
    home: {
      trust_badge_mr: 'श्री. विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट उपक्रम',
      trust_badge_en: 'श्री विश्वनाथराव शामराव पाटिल चैरिटेबल ट्रस्ट की पहल',
      hero_title_1: 'समुदायों को सशक्त बनाना।',
      hero_title_2: 'भोजन की बर्बादी कम करना।',
      hero_desc: 'हम भोजन की प्रचुरता और भूख के बीच की खाई को पाटते हैं। स्थानीय कार्रवाई और विश्वसनीय समन्वय के माध्यम से, हम अतिरिक्त भोजन को उन परिवारों और आश्रयों तक पहुंचाते हैं जिन्हें इसकी सबसे अधिक आवश्यकता है।',
      req_food_btn: 'भोजन सहायता का अनुरोध करें',
      become_donor_btn: 'सत्यापित दाता बनें',

      commitment_title: 'सामाजिक कल्याण के प्रति हमारी प्रतिबद्धता',
      commitment_1_title: 'समन्वित भोजन बचाव नेटवर्क',
      commitment_1_desc: 'श्री विश्वनाथराव शामराव पाटिल चैरिटेबल ट्रस्ट के संरक्षण में संचालित।',
      commitment_2_title: 'सहयोगी स्थानीय गठबंधन',
      commitment_2_desc: 'अतिरिक्त भोजन की उपलब्धता को सत्यापित करने के लिए रेस्तरां और स्थानीय स्वयंसेवकों के साथ सीधे साझेदारी।',
      commitment_3_title: 'व्यापक भोजन वितरण',
      commitment_3_desc: 'महाराष्ट्र भर के परिवारों, अनाथालयों, आश्रय गृहों को ताजा, गुणवत्ता-जांच किया गया भोजन वितरित करना।',
      commitment_4_title: 'प्रत्यक्ष और पारदर्शी प्रभाव',
      commitment_4_desc: 'पूर्ण जवाबदेही के लिए सत्यापित दाताओं और संगठनों के बीच वास्तविक समय अनुरोध ट्रैकिंग और सीधे समन्वय को सक्षम करना।',

      impact_tag: 'वास्तविक परिवर्तन का संकलन',
      impact_title: 'हमारा प्रभाव डैशबोर्ड',
      active_donors: 'सक्रिय दाता',
      active_donors_desc: 'हमारे वितरण का समर्थन करने वाले प्रायोजक',
      food_listed: 'सूचीबद्ध भोजन बैच',
      food_listed_desc: 'सूचीबद्ध कुल अतिरिक्त भोजन आवंटन',
      fulfillments: 'पूरा किया गया भोजन वितरण',
      fulfillments_desc: 'सफलतापूर्वक वितरित भोजन आवंटन',

      pillars_tag: 'हम कैसे समन्वय करते हैं',
      pillars_title: 'कार्यप्रणाली के मुख्य स्तंभ',
      pillar_1_title: 'अतिरिक्त भोजन सूचीबद्ध करें',
      pillar_1_desc: 'पंजीकृत दाता भोजन का प्रकार, मात्रा (प्लेटों की संख्या), संग्रह स्थान और संपर्क मोबाइल निर्दिष्ट करते हैं। लिस्टिंग तुरंत निर्देशिका पर दिखाई देती है।',
      pillar_1_link: 'दाता लॉगिन →',
      pillar_2_title: 'अनुरोध और संग्रह करें',
      pillar_2_desc: 'गैर-सरकारी संगठन, आश्रय गृह और स्वयंसेवक राज्य और शहर के अनुसार सूचीबद्ध भोजन को फ़िल्टर करते हैं। वे मात्रा, उद्देश्य और वितरण पते को निर्दिष्ट करते हुए दावों को जमा करते हैं।',
      pillar_2_link: 'भोजन सूची देखें →',
      pillar_3_title: 'ऑडिट और निगरानी',
      pillar_3_desc: 'सिस्टम प्रशासक क्षेत्रीय कवरेज का प्रबंधन करते हैं, दाता नामांकनों की निगरानी करते हैं, आवश्यकता होने पर दावों को मंजूरी देते हैं, और प्रदर्शन रिपोर्ट संकलित करते हैं।',
      pillar_3_link: 'एडमिन पोर्टल →',

      trust_cta_title: 'भूख मिटाने में हमारी मदद करें',
      trust_cta_desc: 'चाहे आप अतिरिक्त केटरिंग वाले बैंक्वेट हॉल का प्रतिनिधित्व करते हों या सहायता की तलाश में कोई एनजीओ हों, अन्न सेवा भोजन वितरित करने के लिए एक आधुनिक और सत्यापित मंच प्रदान करती है।',
      donate_now: '💝 अभी दान करें',
      reg_as_donor: 'दाता के रूप में पंजीकरण करें',
      contact_office: 'ट्रस्ट कार्यालय से संपर्क करें'
    },
    media: {
      tag: 'मीडिया कवरेज एवं समाचार',
      title: 'अन्न सेवा वृत्तपत्र प्रसिद्धी',
      desc: 'देखें कि प्रमुख समाचार पत्र लातूर और मराठवाड़ा में भोजन की बर्बादी को रोकने और जरूरतमंदों को भोजन कराने के हमारे प्रयासों के बारे में क्या कहते हैं।',
      zoom_badge: '🔍 बड़ा करके पढ़ें',
      view_clip_btn: '📰 पूरी समाचार कतरन देखें'
    },
    about: {
      title: 'अन्न सेवा के बारे में',
      mission_title: 'हमारा उद्देश्य',
      default_mission: 'अन्न सेवा श्री विश्वनाथराव शामराव पाटिल चैरिटेबल ट्रस्ट, लातूर के तहत स्थापित एक समर्पित सामाजिक कल्याण पहल है। हमारा मुख्य उद्देश्य महाराष्ट्र भर में जरूरतमंदों, आश्रयों और सामुदायिक रसोइयों के साथ अतिरिक्त भोजन दाताओं को जोड़कर भूख को समाप्त करना और भोजन की बर्बादी को कम करना है।',
      values_title: 'मुख्य मूल्य और सिद्धांत',
      val_1_title: 'शून्य बर्बादी:',
      val_1_desc: 'यह सुनिश्चित करना कि अतिरिक्त भोजन कचरे में नहीं, बल्कि पेट में जाए।',
      val_2_title: 'सुरक्षा सर्वोपरि:',
      val_2_desc: 'सत्यापित दाताओं को जोड़ना जो भोजन की गुणवत्ता मानकों को बनाए रखते हैं।',
      val_3_title: 'स्थानीय प्रभाव:',
      val_3_desc: 'वितरण सीमाओं को अनुकूलित करने के लिए राज्य और शहर द्वारा अनुरोधों को फ़िल्टर करना।',
      val_4_title: 'प्रत्यक्ष स्वीकृति:',
      val_4_desc: 'दाता इस बात पर पूर्ण नियंत्रण रखते हैं कि उनका सूचीबद्ध भोजन किसे प्राप्त होगा।',

      trustee_name: 'श्री. हृदयनाथ भागवत पाटील',
      trustee_role: 'संस्थापक अध्यक्ष',
      trustee_org: 'संस्थापक अध्यक्ष - श्री. विश्वनाथराव शामराव पाटिल ट्रस्ट, लातूर',
      trustee_job: 'सॉफ्टवेयर डेवलपर - जेडकॉन सॉल्यूशंस प्राइवेट लिमिटेड, कोथरुड',
      trustee_edu: "बी.टेक सीएसई'25 स्नातक - वेल्लोर इंस्टीट्यूट ऑफ टेक्नोलॉजी"
    },
    food: {
      network_tag: 'अतिरिक्त भोजन वितरण नेटवर्क',
      title: 'उपलब्ध भोजन निर्देशिका',
      subtitle: 'सत्यापित दाताओं द्वारा सूचीबद्ध अतिरिक्त भोजन की सक्रिय सूची देखें। एनजीओ, सामुदायिक रसोई और समन्वयक वितरण के लिए सीधे दावे के अनुरोध जमा कर सकते हैं।',
      search_keywords: 'खोज शब्द',
      search_placeholder: 'उदा. चावल, दाल, रोटी...',
      state: 'राज्य',
      all_states: 'सभी राज्य',
      city: 'शहर',
      all_cities: 'सभी शहर',
      filter_btn: 'फ़िल्टर करें',
      reset_btn: 'रीसेट',
      loading: 'भोजन सूची लोड हो रही है...',
      empty_title: 'कोई मेल खाने वाला भोजन नहीं मिला।',
      empty_desc: 'खोज फ़िल्टर को रीसेट करने का प्रयास करें या बाद में जांचें।',

      col_sno: 'क्र.',
      col_contact: 'संपर्क',
      col_food_desc: 'भोजन विवरण',
      col_address: 'संग्रह का पता',
      col_location: 'स्थान',
      col_status: 'स्थिति',
      col_date: 'दिनांक',
      col_action: 'कार्रवाई',

      status_approved: 'अनुरोध स्वीकृत',
      status_completed: 'अनुरोध पूर्ण',
      status_available: 'उपलब्ध',
      btn_claimed: 'दावा किया गया',
      btn_completed: 'पूर्ण हुआ',
      btn_claim_food: 'भोजन का दावा करें',

      modal_title: 'भोजन पैकेज का दावा',
      modal_food_items: 'भोजन सामग्री:',
      modal_contact_donor: 'दाता संपर्क:',
      modal_phone: 'फोन नंबर:',
      modal_location: 'स्थान:',
      modal_address: 'पता:',
      modal_info: 'अतिरिक्त जानकारी:',
      modal_listed_on: 'सूचीबद्ध दिनांक:',
      modal_sub_title: 'आवंटन अनुरोध जमा करें',
      modal_ngo_label: 'एनजीओ / प्राप्तकर्ता संगठन का नाम',
      modal_ngo_placeholder: 'उदा. वी.एस. पाटिल चैरिटेबल ट्रस्ट',
      modal_mobile_label: 'प्राप्तकर्ता मोबाइल नंबर',
      modal_mobile_placeholder: '10 अंकों का मोबाइल',
      modal_select_state: 'राज्य चुनें',
      modal_select_city: 'शहर चुनें',
      modal_delivery_label: 'वितरण का पता',
      modal_delivery_placeholder: 'संग्रह के लिए पते का विवरण',
      modal_reason_label: 'दावे का कारण',
      modal_reason_placeholder: 'उदा. स्थानीय बस्ती में मुफ्त भोजन वितरण',
      modal_qty_label: 'मांगी गई मात्रा',
      modal_qty_placeholder: 'उदा. 20 पैकेट',
      modal_submitting: 'अनुरोध जमा किया जा रहा है...',
      modal_confirm_btn: 'दावे की पुष्टि करें'
    },
    donate: {
      tax_badge: 'धारा 80G के तहत कर छूट',
      hero_title: 'अभी दान करें और बदलाव लाएं',
      hero_desc: 'आपका योगदान हमें महाराष्ट्र भर में भूखों को खाना खिलाने और भोजन की बर्बादी को कम करने में मदद करता है।',
      card_title: '💝 दान करें',
      select_amount: 'राशि चुनें (₹)',
      custom_amount_label: 'या अन्य राशि दर्ज करें',
      custom_amount_placeholder: 'राशि दर्ज करें',
      name_label: 'पूरा नाम *',
      name_placeholder: 'अपना पूरा नाम दर्ज करें',
      email_label: 'ईमेल पता *',
      email_placeholder: 'your@email.com',
      mobile_label: 'मोबाइल नंबर *',
      mobile_placeholder: '10 अंकों का मोबाइल',
      pan_label: 'पैन नंबर',
      pan_sub: '(80G रसीद के लिए)',
      pan_placeholder: 'ABCDE1234F',
      summary_label: 'दान राशि',
      submit_btn: '🙏 Razorpay द्वारा दान करें',
      processing: 'प्रक्रिया जारी है...',
      razorpay_note: 'Razorpay द्वारा सुरक्षित · UPI, कार्ड, नेट बैंकिंग स्वीकार्य',

      trust_card_title: 'ट्रस्ट विवरण',
      trust_name_label: 'ट्रस्ट का नाम',
      trust_name_val: 'श्री विश्वनाथराव शामराव पाटिल चैरिटेबल ट्रस्ट',
      trust_address_label: 'पता',
      trust_address_val: 'हृदयनाथ भागवत पाटिल, ए1 मातोश्री एम्पायर, लातूर',
      pan_code_label: 'पैन',
      urn_code_label: '80G यूआरएन',
      validity_label: 'स्वीकृति वैधता',
      validity_val: 'वर्ष 2026-27 से वर्ष 2028-2029',

      bank_card_title: 'बैंक हस्तांतरण विवरण',
      acc_name_label: 'खाता नाम',
      acc_name_val: 'श्री विश्वनाथराव शामराव पाटिल चै. ट्रस्ट',
      acc_no_label: 'खाता संख्या',
      acc_no_val: '000100780002245',
      ifsc_label: 'आईएफएससी कोड',
      ifsc_val: 'HDFC0YNSBL',
      qr_scan_label: 'PhonePe से स्कैन करें',
      bank_transfer_note: 'ℹ️ बैंक ट्रांसफर के लिए, 80G प्रमाणपत्र प्राप्त करने हेतु कृपया रसीद vspatil.charitabletrust@gmail.com पर ईमेल करें।',

      tax_box_title: '🧾 80G कर छूट',
      tax_box_desc: 'यह दान आयकर अधिनियम, 1961 की धारा 80G के तहत कटौती के लिए पात्र है।',
      tax_point_1: 'कानूनी अनुपालन संदर्भ: 12-Sub-clause (A) of clause (iv) of first proviso to section 80G(5)',
      tax_point_2: 'प्रधान आयकर आयुक्त द्वारा अनुमोदित',

      how_title: 'यह कैसे काम करता है',
      step_1: 'अपनी दान राशि चुनें या दर्ज करें',
      step_2: '80G रसीद के लिए अपना विवरण भरें',
      step_3: 'Razorpay द्वारा सुरक्षित भुगतान करें (UPI/Card/NetBanking)',
      step_4: 'अपनी दान रसीद और 80G प्रमाणपत्र प्राप्त करें',

      receipt_success_title: 'दान सफल रहा!',
      receipt_thank: 'आपकी उदारता के लिए धन्यवाद,',
      receipt_amount: 'राशि',
      receipt_date: 'दिनांक',
      receipt_payment_id: 'भुगतान आईडी',
      receipt_order_id: 'ऑर्डर आईडी',
      receipt_footer_note: 'एक औपचारिक 80G रसीद आपके ईमेल पर भेजी जाएगी।'
    },
    contact: {
      title: 'हमसे संपर्क करें',
      desc_default: 'किसी भी प्रश्न, साझेदारी के प्रस्ताव या रसद संबंधी चिंताओं के लिए हमसे संपर्क करें। फ़ॉर्म भरें या हमें सीधे लिखें।',
      email_title: 'ईमेल पता',
      email_val: 'vspatil.charitabletrust@gmail.com',
      helpline_title: 'हेल्पलाइन नंबर',
      helpline_val: '+91 1800-111-222',
      office_title: 'केंद्रीय कार्यालय',
      office_val: 'मातोश्री एम्पायर, लातूर, महाराष्ट्र, भारत',

      form_title: 'संदेश भेजें',
      name_label: 'पूरा नाम',
      name_placeholder: 'अपना नाम दर्ज करें',
      email_label: 'ईमेल पता',
      email_placeholder: 'अपना ईमेल दर्ज करें',
      mobile_label: 'मोबाइल नंबर',
      mobile_placeholder: '10 अंकों का मोबाइल दर्ज करें',
      message_label: 'आपका संदेश',
      message_placeholder: 'अपना संदेश यहाँ लिखें...',
      submitting: 'भेजा जा रहा है...',
      submit_btn: 'संदेश भेजें'
    },
    donor_auth: {
      login_title: 'दाता लॉगिन',
      email_label: 'ईमेल पता',
      email_placeholder: 'उदा. patil@donor.com',
      password_label: 'पासवर्ड',
      password_placeholder: 'पासवर्ड दर्ज करें',
      show: 'दिखाएं',
      hide: 'छिपाएं',
      forgot_password: 'पासवर्ड भूल गए?',
      logging_in: 'लॉगिन हो रहा है...',
      login_btn: 'लॉगिन',
      admin_portal_btn: 'एडमिन पोर्टल लॉगिन',
      no_account: 'खाता नहीं है?',
      register_here: 'यहाँ पंजीकरण करें',

      register_title: 'दाता पंजीकरण',
      name_label: 'पूरा नाम',
      name_placeholder: 'नाम दर्ज करें',
      mobile_label: 'मोबाइल नंबर',
      mobile_placeholder: '10 अंकों का मोबाइल',
      state_label: 'राज्य',
      select_state: 'राज्य चुनें',
      city_label: 'शहर',
      select_city: 'शहर चुनें',
      address_label: 'पता',
      address_placeholder: 'उदा. बी755 कोल्हापुर',
      submitting: 'जमा हो रहा है...',
      register_btn: 'पंजीकरण के लिए स्वीकृति हेतु भेजें',
      already_account: 'क्या आपके पास पहले से खाता है?',

      reg_submitted_title: 'पंजीकरण जमा किया गया!',
      reg_submitted_desc: 'अन्न सेवा के साथ भोजन दाता के रूप में पंजीकरण करने के लिए धन्यवाद। आपका पंजीकरण प्रशासक की स्वीकृति के लिए प्रस्तुत किया गया है। स्वीकृति के बाद, आप भोजन सूची पोस्ट करने के लिए लॉगिन कर सकेंगे।',
      go_home: 'मुख्य पृष्ठ पर जाएं',
      go_login: 'लॉगिन पृष्ठ'
    },
    admin_auth: {
      login_title: 'एडमिन पोर्टल',
      email_label: 'एडमिन ईमेल',
      email_placeholder: 'उदा. admin@annaseva.org',
      password_label: 'पासवर्ड',
      password_placeholder: 'पासवर्ड दर्ज करें',
      authenticating: 'प्रमाणित हो रहा है...',
      access_btn: 'डैशबोर्ड खोलें'
    },
    password_reset: {
      forgot_title: 'पासवर्ड भूल गए',
      forgot_desc: 'अपना पंजीकृत ईमेल पता दर्ज करें। हम आपके खाते के लिए एक सुरक्षित पासवर्ड रीसेट लिंक बनाएंगे।',
      email_placeholder: 'उदा. hriday@donor.com',
      requesting: 'अनुरोध किया जा रहा है...',
      send_link_btn: 'रीसेट लिंक भेजें',
      remember_password: 'अपना पासवर्ड याद है?',
      back_to_login: 'लॉगिन पर वापस जाएं',

      reset_title: 'पासवर्ड रीसेट करें',
      reset_desc: 'कृपया अपना नया पासवर्ड नीचे दर्ज करें।',
      new_password_label: 'नया पासवर्ड',
      new_password_placeholder: 'कम से कम 6 अक्षर',
      confirm_password_label: 'पासवर्ड की पुष्टि करें',
      confirm_password_placeholder: 'पासवर्ड दोबारा दर्ज करें',
      updating: 'अद्यतन हो रहा है...',
      reset_btn: 'पासवर्ड रीसेट करें',
      invalid_link_title: 'अमान्य रीसेट लिंक',
      invalid_link_desc: 'लिंक में कोई रीसेट टोकन नहीं मिला। कृपया एक नया रीसेट लिंक अनुरोध करें।',
      request_new_link: 'नया लिंक अनुरोध करें'
    },
    footer: {
      trust_title: 'श्री विश्वनाथराव शामराव पाटिल चैरिटेबल ट्रस्ट, लातूर',
      rights: '© 2026 अन्न सेवा। सर्वाधिकार सुरक्षित। दाताओं को जोड़ना और जरूरतमंदों को भोजन कराना।'
    }
  },

  mr: {
    nav: {
      home: 'मुखपृष्ठ',
      about: 'आमच्याबद्दल',
      available_food: 'उपलब्ध अन्न सूची',
      donate: 'दान करा',
      contact: 'संपर्क',
      donor: 'दाता',
      admin: 'ॲडमिन',
      dashboard: 'डॅशबोर्ड',
      language: 'भाषा',
      select_language: 'भाषा निवडा',
      english: 'English',
      hindi: 'हिंदी (Hindi)',
      marathi: 'मराठी (Marathi)'
    },
    home: {
      trust_badge_mr: 'श्री. विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट उपक्रम',
      trust_badge_en: 'श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्टचा उपक्रम',
      hero_title_1: 'समुदायांना सक्षम करणे.',
      hero_title_2: 'अन्नाची नासाडी कमी करणे.',
      hero_desc: 'आम्ही अन्नाची मुबलकता आणि भूक यातील अंतर कमी करतो. स्थानिक कृती आणि विश्वासू समन्वयाद्वारे, आम्ही अतिरिक्त अन्न ज्यांना याची सर्वात जास्त गरज आहे अशा कुटुंबांपर्यंत आणि निवाऱ्यांपर्यंत पोहोचवतो.',
      req_food_btn: 'अन्न मदतीसाठी विनंती करा',
      become_donor_btn: 'सत्यापित दाता बना',

      commitment_title: 'सामाजिक कल्याणासाठी आमची वचनबद्धता',
      commitment_1_title: 'समन्वित अन्न बचाव नेटवर्क',
      commitment_1_desc: 'श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्टच्या मार्गदर्शनाखाली संचलित.',
      commitment_2_title: 'स्थानिक संस्थांचे सहकार्य',
      commitment_2_desc: 'अतिरिक्त अन्नाची उपलब्धता तपासण्यासाठी हॉटेल्स, मंगल कार्यालये आणि स्वयंसेवकांशी थेट सहकार्य.',
      commitment_3_title: 'व्यापक अन्न वाटप',
      commitment_3_desc: 'संपूर्ण महाराष्ट्रातील कुटुंबे, अनाथालये आणि वृद्धाश्रमांपर्यंत ताजे आणि दर्जेदार अन्न पोहोचवणे.',
      commitment_4_title: 'थेट आणि पारदर्शक परिणाम',
      commitment_4_desc: 'पूर्ण पारदर्शकतेसाठी सत्यापित दाते आणि संस्था यांच्यात रिअल-टाईम विनंती ट्रॅकिंग आणि थेट समन्वय সাধणे.',

      impact_tag: 'वास्तविक बदलाचा मागोवा',
      impact_title: 'आमचा प्रभाव डॅशबोर्ड',
      active_donors: 'सक्रिय दाते',
      active_donors_desc: 'अन्न वाटपास पाठिंबा देणारे समर्थक',
      food_listed: 'सूचीबद्ध अन्न बॅच',
      food_listed_desc: 'नोंदणीकृत एकूण अतिरिक्त अन्न साठा',
      fulfillments: 'पूर्ण केलेले अन्न वाटप',
      fulfillments_desc: 'यशस्वीपणे पूर्ण झालेले थेट वाटप',

      pillars_tag: 'आम्ही समन्वय कसा करतो',
      pillars_title: 'कार्यप्रणालीचे मुख्य स्तंभ',
      pillar_1_title: 'अतिरिक्त अन्नाची नोंदणी करा',
      pillar_1_desc: 'नोंदणीकृत दाते अन्नाचा प्रकार, प्रमाण (प्लेटची संख्या), संकलन ठिकाण आणि मोबाईल नंबर नमूद करतात. ही नोंदणी लगेचच सार्वजनिक सूचीवर प्रदर्शित होते.',
      pillar_1_link: 'दाता लॉगिन →',
      pillar_2_title: 'विनंती आणि अन्न संकलन',
      pillar_2_desc: 'स्वयंसेवी संस्था (NGO), निवारा गृहे आणि स्वयंसेवक राज्य आणि शहरानुसार उपलब्ध अन्न शोधतात. ते प्रमाण, कारण आणि पत्ता नमूद करून अन्न मिळवण्यासाठी विनंती सादर करतात.',
      pillar_2_link: 'अन्न सूची पहा →',
      pillar_3_title: 'तपासणी आणि देखरेख',
      pillar_3_desc: 'प्रशासक प्रादेशिक कार्यक्षेत्राचे व्यवस्थापन करतात, दात्यांच्या नोंदणीवर देखरेख ठेवतात, गरजेनुसार विनंत्यांना मंजुरी देतात आणि अहवाल तयार करतात.',
      pillar_3_link: 'ॲडमिन पोर्टल →',

      trust_cta_title: 'भूकमुक्त समाज निर्मितीत मदत करा',
      trust_cta_desc: 'तुमचे लग्न कार्यालय असो, हॉटेल असो किंवा अन्नाची गरज असणारी स्वयंसेवी संस्था असो, अन्न सेवा ताजे अन्न सुरक्षितपणे पोहोचवण्यासाठी एक आधुनिक आणि विश्वासू मंच प्रदान करते.',
      donate_now: '💝 आता दान करा',
      reg_as_donor: 'दाता म्हणून नोंदणी करा',
      contact_office: 'ट्रस्ट कार्यालयाशी संपर्क करा'
    },
    media: {
      tag: 'माध्यम प्रसिद्धी व बातम्या',
      title: 'अन्न सेवा वृत्तपत्र प्रसिद्धी',
      desc: 'लातूर व मराठवाड्यात अन्नाची नासाडी रोखण्यासाठी आणि गरजूंना अन्न पुरवण्यासाठी आमच्या प्रयत्नांबद्दल वृत्तपत्रांनी प्रसिद्ध केलेल्या बातम्या पहा.',
      zoom_badge: '🔍 मोठे करून वाचण्यासाठी क्लिक करा',
      view_clip_btn: '📰 संपूर्ण बातमी पहा'
    },
    about: {
      title: 'अन्न सेवा बद्दल',
      mission_title: 'आमचे ध्येय',
      default_mission: 'अन्न सेवा हा श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट, लातूर अंतर्गत सुरू केलेला एक सामाजिक उपक्रम आहे. आमचे मुख्य ध्येय महाराष्ट्रातील गरजूंना, निवारा गृहांना आणि अन्नछत्रांना अतिरिक्त अन्न दात्यांशी जोडून भूक निर्मूलन करणे आणि अन्नाची नासाडी रोखणे हे आहे.',
      values_title: 'प्रमुख मूल्य आणि तत्त्वे',
      val_1_title: 'शून्य नासाडी:',
      val_1_desc: 'अतिरिक्त अन्न कचऱ्यात न जाता गरजूंच्या पोटात जाईल याची खात्री करणे.',
      val_2_title: 'सुरक्षा प्रथम:',
      val_2_desc: 'अन्नाचा दर्जा आणि गुणवत्ता जपणारे सत्यापित दाते जोडणे.',
      val_3_title: 'स्थानिक प्रभाव:',
      val_3_desc: 'अन्न वाटपाचे अंतर आणि वेळ कमी करण्यासाठी राज्य आणि शहरानुसार विनंत्या फिल्टर करणे.',
      val_4_title: 'थेट मंजुरी:',
      val_4_desc: 'आपले अन्न कोणाला द्यायचे यावर दात्यांचे पूर्ण नियंत्रण असते.',

      trustee_name: 'श्री. हृदयनाथ भागवत पाटील',
      trustee_role: 'संस्थापक अध्यक्ष',
      trustee_org: 'संस्थापक अध्यक्ष - श्री. विश्वनाथराव शामराव पाटील ट्रस्ट, लातूर',
      trustee_job: 'सॉफ्टवेअर डेव्हलपर - झेडकॉन सोल्यूशन्स प्रा. लि., कोथरूड',
      trustee_edu: "बी.टेक सीएसई'25 पदवीधर - वेल्लोर इन्स्टिट्यूट ऑफ तंत्रज्ञान"
    },
    food: {
      network_tag: 'अतिरिक्त अन्न वाटप जाळे',
      title: 'उपलब्ध अन्न सूची',
      subtitle: 'सत्यापित दात्यांनी नोंदवलेल्या अतिरिक्त अन्नाची यादी पहा. स्वयंसेवी संस्था (NGO) आणि स्वयंसेवक अन्न वाटपासाठी थेट विनंती सादर करू शकतात.',
      search_keywords: 'शोध शब्द',
      search_placeholder: 'उदा. भात, आमटी, पोळी...',
      state: 'राज्य',
      all_states: 'सर्व राज्ये',
      city: 'शहर',
      all_cities: 'सर्व शहरे',
      filter_btn: 'शोधा / फिल्टर करा',
      reset_btn: 'रीसेट',
      loading: 'अन्न सूची लोड होत आहे...',
      empty_title: 'कोणतेही अन्न उपलब्ध नाही.',
      empty_desc: 'शोध फिल्टर रीसेट करून पहा किंवा नंतर तपासा.',

      col_sno: 'अ.क्र.',
      col_contact: 'संपर्क',
      col_food_desc: 'अन्न वर्णन',
      col_address: 'संकलन पत्ता',
      col_location: 'ठिकाण',
      col_status: 'स्थिती',
      col_date: 'तारीख',
      col_action: 'कृती',

      status_approved: 'विनंती मंजूर',
      status_completed: 'वाटप पूर्ण',
      status_available: 'उपलब्ध',
      btn_claimed: 'स्वीकृत',
      btn_completed: 'पूर्ण',
      btn_claim_food: 'अन्न मिळवा',

      modal_title: 'अन्न पॅकेजचा दावा',
      modal_food_items: 'अन्न पदार्थ:',
      modal_contact_donor: 'दाता संपर्क:',
      modal_phone: 'फोन नंबर:',
      modal_location: 'ठिकाण:',
      modal_address: 'पत्ता:',
      modal_info: 'अतिरिक्त माहिती:',
      modal_listed_on: 'नोंदणी तारीख:',
      modal_sub_title: 'अन्न वाटपाची विनंती सादर करा',
      modal_ngo_label: 'संस्था / स्वीकारणाऱ्याचे नाव',
      modal_ngo_placeholder: 'उदा. व्ही.एस. पाटील चॅरिटेबल ट्रस्ट',
      modal_mobile_label: 'स्वीकारणाऱ्याचा मोबाईल नंबर',
      modal_mobile_placeholder: '१० अंकी मोबाईल',
      modal_select_state: 'राज्य निवडा',
      modal_select_city: 'शहर निवडा',
      modal_delivery_label: 'अन्न संकलन / वाटपाचा पत्ता',
      modal_delivery_placeholder: 'संकलनासाठी पत्ता',
      modal_reason_label: 'विनंतीचे कारण',
      modal_reason_placeholder: 'उदा. गरीब वस्तीत मोफत अन्न वाटप',
      modal_qty_label: 'गरज असलेले प्रमाण',
      modal_qty_placeholder: 'उदा. २० पाकिटे',
      modal_submitting: 'विनंती सादर होत आहे...',
      modal_confirm_btn: 'विनंती सबमिट करा'
    },
    donate: {
      tax_badge: 'कलम 80G अंतर्गत कर सवलत',
      hero_title: 'आता दान करा आणि योगदान द्या',
      hero_desc: 'तुमचे अमूल्य योगदान महाराष्ट्रातील भुकेलेल्यांना अन्न देण्यास आणि अन्नाची नासाडी रोखण्यास मदत करते.',
      card_title: '💝 दान करा',
      select_amount: 'रक्कम निवडा (₹)',
      custom_amount_label: 'किंवा तुमची रक्कम प्रविष्ट करा',
      custom_amount_placeholder: 'रक्कम टाका',
      name_label: 'संपूर्ण नाव *',
      name_placeholder: 'तुमचे नाव टाका',
      email_label: 'ईमेल पत्ता *',
      email_placeholder: 'your@email.com',
      mobile_label: 'मोबाईल नंबर *',
      mobile_placeholder: '१० अंकी मोबाईल',
      pan_label: 'पॅन कार्ड नंबर',
      pan_sub: '(80G पावतीसाठी)',
      pan_placeholder: 'ABCDE1234F',
      summary_label: 'दान रक्कम',
      submit_btn: '🙏 Razorpay द्वारे दान करा',
      processing: 'प्रक्रिया सुरू आहे...',
      razorpay_note: 'Razorpay द्वारे सुरक्षित · UPI, कार्डे, नेट बँकिंग स्वीकार्य',

      trust_card_title: 'ट्रस्ट तपशील',
      trust_name_label: 'ट्रस्टचे नाव',
      trust_name_val: 'श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट',
      trust_address_label: 'पत्ता',
      trust_address_val: 'हृदयनाथ भागवत पाटील, ए१ मातोश्री एम्पायर, लातूर',
      pan_code_label: 'पॅन',
      urn_code_label: '80G युआरएन',
      validity_label: 'मंजुरी वैधता',
      validity_val: 'वर्ष २०२६-२७ ते वर्ष २०२८-२०२९',

      bank_card_title: 'बँक ट्रान्सफर तपशील',
      acc_name_label: 'खातेदाराचे नाव',
      acc_name_val: 'श्री विश्वनाथराव शामराव पाटील चॅ. ट्रस्ट',
      acc_no_label: 'खाते क्रमांक',
      acc_no_val: '000100780002245',
      ifsc_label: 'आयएफएससी कोड',
      ifsc_val: 'HDFC0YNSBL',
      qr_scan_label: 'PhonePe ने स्कॅन करा',
      bank_transfer_note: 'ℹ️ बँक ट्रान्सफरसाठी, 80G प्रमाणपत्र मिळविण्यासाठी कृपया पावती vspatil.charitabletrust@gmail.com वर ईमेल करा.',

      tax_box_title: '🧾 80G कर सवलत',
      tax_box_desc: 'हे दान प्राप्तिकर कायदा, १९६१ च्या कलम 80G अंतर्गत कर सवलतीस पात्र आहे.',
      tax_point_1: 'कायदेशीर संदर्भ: 12-Sub-clause (A) of clause (iv) of first proviso to section 80G(5)',
      tax_point_2: 'मुख्य प्राप्तिकर आयुक्तांद्वारे मंजूर',

      how_title: 'हे कसे कार्य करते',
      step_1: 'दान रक्कम निवडा किंवा टाका',
      step_2: '80G पावतीसाठी तुमची माहिती भरा',
      step_3: 'Razorpay द्वारे सुरक्षित पेमेंट करा (UPI/Card/NetBanking)',
      step_4: 'तुमची दान पावती आणि 80G प्रमाणपत्र मिळवा',

      receipt_success_title: 'दान यशस्वी झाले!',
      receipt_thank: 'तुमच्या औदार्याबद्दल धन्यवाद,',
      receipt_amount: 'रक्कम',
      receipt_date: 'तारीख',
      receipt_payment_id: 'पेमेंट आयडी',
      receipt_order_id: 'ऑर्डर आयडी',
      receipt_footer_note: 'औपचारिक 80G पावती तुमच्या ईमेलवर पाठवली जाईल.'
    },
    contact: {
      title: 'आमच्याशी संपर्क साधा',
      desc_default: 'कोणत्याही प्रश्नांसाठी, सहकार्यासाठी किंवा अन्न वाटपाच्या माहितीसाठी आमच्याशी संपर्क साधा. फॉर्म भरा किंवा थेट ईमेल करा.',
      email_title: 'ईमेल पत्ता',
      email_val: 'vspatil.charitabletrust@gmail.com',
      helpline_title: 'हेल्पलाइन क्रमांक',
      helpline_val: '+91 1800-111-222',
      office_title: 'मध्यवर्ती कार्यालय',
      office_val: 'मातोश्री एम्पायर, लातूर, महाराष्ट्र, भारत',

      form_title: 'संदेश पाठवा',
      name_label: 'संपूर्ण नाव',
      name_placeholder: 'तुमचे नाव टाका',
      email_label: 'ईमेल पत्ता',
      email_placeholder: 'तुमचा ईमेल टाका',
      mobile_label: 'मोबाईल नंबर',
      mobile_placeholder: '१० अंकी मोबाईल टाका',
      message_label: 'तुमचा संदेश',
      message_placeholder: 'तुमचा संदेश येथे लिहा...',
      submitting: 'पाठवत आहे...',
      submit_btn: 'संदेश सबमिट करा'
    },
    donor_auth: {
      login_title: 'दाता लॉगिन',
      email_label: 'ईमेल पत्ता',
      email_placeholder: 'उदा. patil@donor.com',
      password_label: 'पासवर्ड',
      password_placeholder: 'पासवर्ड टाका',
      show: 'दाखवा',
      hide: 'लपवा',
      forgot_password: 'पासवर्ड विसरलात?',
      logging_in: 'लॉगिन होत आहे...',
      login_btn: 'लॉगिन',
      admin_portal_btn: 'ॲडमिन पोर्टल लॉगिन',
      no_account: 'खाते नाही?',
      register_here: 'येथे नोंदणी करा',

      register_title: 'दाता नोंदणी',
      name_label: 'संपूर्ण नाव',
      name_placeholder: 'नाव टाका',
      mobile_label: 'मोबाईल नंबर',
      mobile_placeholder: '१० अंकी मोबाईल',
      state_label: 'राज्य',
      select_state: 'राज्य निवडा',
      city_label: 'शहर',
      select_city: 'शहर निवडा',
      address_label: 'पत्ता',
      address_placeholder: 'उदा. बी७५५ कोल्हापूर',
      submitting: 'सादर होत आहे...',
      register_btn: 'नोंदणीच्या मंजुरीसाठी पाठवा',
      already_account: 'आधीपासून खाते आहे का?',

      reg_submitted_title: 'नोंदणी सादर झाली!',
      reg_submitted_desc: 'अन्न सेवा सोबत अन्न दाता म्हणून नोंदणी केल्याबद्दल धन्यवाद. तुमची नोंदणी प्रशासकाच्या मंजुरीसाठी पाठवण्यात आली आहे. मंजुरी मिळाल्यावर तुम्हाला लॉगिन करून अन्न पोस्ट करता येईल.',
      go_home: 'मुखपृष्ठावर जा',
      go_login: 'लॉगिन पृष्ठ'
    },
    admin_auth: {
      login_title: 'ॲडमिन पोर्टल',
      email_label: 'ॲडमिन ईमेल',
      email_placeholder: 'उदा. admin@annaseva.org',
      password_label: 'पासवर्ड',
      password_placeholder: 'पासवर्ड टाका',
      authenticating: 'प्रमाणित होत आहे...',
      access_btn: 'डॅशबोर्ड उघडा'
    },
    password_reset: {
      forgot_title: 'पासवर्ड विसरलात',
      forgot_desc: 'तुमचा नोंदणीकृत ईमेल पत्ता प्रविष्ट करा. आम्ही तुमच्या खात्यासाठी सुरक्षित पासवर्ड रीसेट लिंक तयार करू.',
      email_placeholder: 'उदा. hriday@donor.com',
      requesting: 'विनंती करत आहे...',
      send_link_btn: 'रीसेट लिंक पाठवा',
      remember_password: 'पासवर्ड आठवला?',
      back_to_login: 'लॉगिनवर जा',

      reset_title: 'पासवर्ड रीसेट करा',
      reset_desc: 'कृपया खाली तुमचा नवीन पासवर्ड टाका.',
      new_password_label: 'नवीन पासवर्ड',
      new_password_placeholder: 'किमान ६ अक्षरे',
      confirm_password_label: 'पासवर्डची पुष्टी करा',
      confirm_password_placeholder: 'पासवर्ड पुन्हा टाका',
      updating: 'अपडेट होत आहे...',
      reset_btn: 'पासवर्ड रीसेट करा',
      invalid_link_title: 'अवैध रीसेट लिंक',
      invalid_link_desc: 'लिंकमध्ये रीसेट टोकन आढळले नाही. कृपया नवीन रीसेट लिंकची विनंती करा.',
      request_new_link: 'नवीन लिंक मागवा'
    },
    footer: {
      trust_title: 'श्री विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट, लातूर',
      rights: '© 2026 अन्न सेवा. सर्व हक्क सुरक्षित. दात्यांना जोडणे व गरजूंना अन्न पुरवणे.'
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('annaseva_lang');
    if (savedLang && ['en', 'hi', 'mr'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (['en', 'hi', 'mr'].includes(lang)) {
      setLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('annaseva_lang', lang);
      }
    }
  };

  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language] || translations['en'];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation key missing in current language
        let fallbackCurrent = translations['en'];
        for (const k of keys) {
          if (fallbackCurrent && fallbackCurrent[k] !== undefined) {
            fallbackCurrent = fallbackCurrent[k];
          } else {
            return fallback || path;
          }
        }
        return fallbackCurrent;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, translations, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
