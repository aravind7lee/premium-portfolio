import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FiUser, FiMail, FiMessageSquare, FiBriefcase, FiCheck, FiX, FiArrowRight, FiArrowLeft, FiSend } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';

const WEB3FORMS_ACCESS_KEY = "5d71368d-2672-4f5c-91e1-dbb7cc66c8b3";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const STEPS = [
  { id: 1, title: 'Personal Info', icon: FiUser },
  { id: 2, title: 'Project Details', icon: FiBriefcase },
  { id: 3, title: 'Your Message', icon: FiMessageSquare }
];

const PremiumContactForm = () => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    projectType: '',
    message: '',
    timeline: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const messageRef = useRef(null);

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 1000) return 'Message must not exceed 1000 characters';
        return '';
      case 'projectType':
        if (!value && currentStep === 2) return 'Please select a project type';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      newErrors.name = validateField('name', formData.name);
      newErrors.email = validateField('email', formData.email);
    } else if (step === 2) {
      newErrors.projectType = validateField('projectType', formData.projectType);
    } else if (step === 3) {
      newErrors.message = validateField('message', formData.message);
    }
    
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      projectType: true,
      message: true
    });
    
    return !Object.values(newErrors).some(error => error);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        budget: formData.budget,
        projectType: formData.projectType,
        timeline: formData.timeline,
        message: formData.message,
        source: 'premium-portfolio-contact'
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        triggerConfetti();
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            company: '',
            budget: '',
            projectType: '',
            message: '',
            timeline: ''
          });
          setCurrentStep(1);
          setSubmitSuccess(false);
          setErrors({});
          setTouched({});
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = formData.message.length;
  const maxLength = 1000;

  const inputClass = `w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 ${
    isDark 
      ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:bg-white/8' 
      : 'bg-black/5 border border-black/10 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white'
  }`;

  const errorClass = 'text-red-400 text-xs mt-1 flex items-center gap-1';
  const successClass = 'text-green-400 text-xs mt-1 flex items-center gap-1';

  return (
    <div className={`relative w-full max-w-4xl mx-auto p-8 rounded-3xl ${
      isDark ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30' : 'bg-gradient-to-br from-white to-gray-50'
    } backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
      
      {/* Success Overlay */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-center p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
              >
                <FiCheck className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-3"
              >
                Message Sent! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80"
              >
                Thank you for reaching out! I'll get back to you soon.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className="flex flex-col items-center flex-1"
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                        : isActive
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : isDark
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : isDark ? 'text-white/40' : 'text-gray-400'}`} />
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium ${
                    isActive ? (isDark ? 'text-white' : 'text-gray-900') : isDark ? 'text-white/40' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
                
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > step.id
                      ? 'bg-gradient-to-r from-green-400 to-emerald-600'
                      : isDark
                      ? 'bg-white/10'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass}
                  placeholder="John Doe"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {touched.name && errors.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={errorClass}
                    >
                      <FiX className="w-3 h-3" />
                      {errors.name}
                    </motion.div>
                  )}
                  {touched.name && !errors.name && formData.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={successClass}
                    >
                      <FiCheck className="w-3 h-3" />
                      Looks good!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Email Address *
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass}
                  placeholder="john@example.com"
                  whileFocus={{ scale: 1.01 }}
                />
                <AnimatePresence>
                  {touched.email && errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={errorClass}
                    >
                      <FiX className="w-3 h-3" />
                      {errors.email}
                    </motion.div>
                  )}
                  {touched.email && !errors.email && formData.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={successClass}
                    >
                      <FiCheck className="w-3 h-3" />
                      Valid email!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Company (Optional)
                </label>
                <motion.input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your Company"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Project Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Web Development', 'Mobile App', 'UI/UX Design', 'Consulting', 'Other'].map((type) => (
                    <motion.button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, projectType: type }));
                        setTouched(prev => ({ ...prev, projectType: true }));
                        setErrors(prev => ({ ...prev, projectType: '' }));
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.projectType === type
                          ? 'border-purple-500 bg-purple-500/10'
                          : isDark
                          ? 'border-white/10 hover:border-white/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={`text-sm font-medium ${
                        formData.projectType === type
                          ? 'text-purple-400'
                          : isDark
                          ? 'text-white/80'
                          : 'text-gray-700'
                      }`}>
                        {type}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {touched.projectType && errors.projectType && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={errorClass}
                    >
                      <FiX className="w-3 h-3" />
                      {errors.projectType}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Budget Range (Optional)
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23${isDark ? 'ffffff' : '000000'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>Select your budget</option>
                  <option value="₹2,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹2,000</option>
                  <option value="₹3,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹3,000</option>
                  <option value="₹5,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹5,000</option>
                  <option value="₹7,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹7,000</option>
                  <option value="₹10,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹10,000</option>
                  <option value="₹15,000" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹15,000</option>
                  <option value="₹15,000+" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>₹15,000+ (Custom)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Timeline (Optional)
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23${isDark ? 'ffffff' : '000000'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>Select timeline</option>
                  <option value="ASAP" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>ASAP (Urgent)</option>
                  <option value="1-2 weeks" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>1-2 weeks</option>
                  <option value="2-4 weeks" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>2-4 weeks</option>
                  <option value="1-2 months" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>1-2 months</option>
                  <option value="2-3 months" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>2-3 months</option>
                  <option value="3-6 months" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>3-6 months</option>
                  <option value="6+ months" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>6+ months (Long-term)</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 3: Message */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Your Message *
                  </label>
                  <motion.span
                    className={`text-xs ${
                      messageLength > maxLength
                        ? 'text-red-400'
                        : messageLength > maxLength * 0.9
                        ? 'text-yellow-400'
                        : isDark
                        ? 'text-white/40'
                        : 'text-gray-400'
                    }`}
                    animate={{
                      scale: messageLength > maxLength ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {messageLength} / {maxLength}
                  </motion.span>
                </div>
                <motion.textarea
                  ref={messageRef}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClass} min-h-[200px] resize-none`}
                  placeholder="Tell me about your project, goals, and how I can help..."
                  whileFocus={{ scale: 1.01 }}
                />
                
                {/* Character Counter Progress Bar */}
                <div className="mt-2">
                  <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <motion.div
                      className={`h-full ${
                        messageLength > maxLength
                          ? 'bg-red-500'
                          : messageLength > maxLength * 0.9
                          ? 'bg-yellow-500'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((messageLength / maxLength) * 100, 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {touched.message && errors.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={errorClass}
                    >
                      <FiX className="w-3 h-3" />
                      {errors.message}
                    </motion.div>
                  )}
                  {touched.message && !errors.message && formData.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={successClass}
                    >
                      <FiCheck className="w-3 h-3" />
                      Message looks great!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <motion.button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
            whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
          >
            <FiArrowLeft />
            Previous
          </motion.button>

          {currentStep < STEPS.length ? (
            <motion.button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <FiArrowRight />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend />
                  Send Message
                </>
              )}
            </motion.button>
          )}
        </div>

        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {errors.submit}
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default PremiumContactForm;
