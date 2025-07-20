import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaExclamationCircle, FaComments, FaTimes } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [typingStatus, setTypingStatus] = useState({});
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Character limits
    const charLimits = {
        name: 50,
        email: 100,
        subject: 100,
        message: 500
    };

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const closePopup = () => {
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Set typing status
        setTypingStatus(prev => ({ ...prev, [name]: true }));

        // Clear previous timeout if exists
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set timeout to clear typing status after 1 second
        setTypingTimeout(setTimeout(() => {
            setTypingStatus(prev => ({ ...prev, [name]: false }));
        }, 1000));

        // Validate field in real-time
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errors = { ...validationErrors };

        switch (name) {
            case 'email':
                if (!value) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = 'Invalid email format';
                } else {
                    delete errors.email;
                }
                break;

            case 'name':
                if (!value) {
                    errors.name = 'Name is required';
                } else {
                    delete errors.name;
                }
                break;

            case 'message':
                if (!value) {
                    errors.message = 'Message is required';
                } else {
                    delete errors.message;
                }
                break;

            default:
                break;
        }

        setValidationErrors(errors);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: 'service_e5e6hzw',
                    template_id: 'template_en9wpdk',
                    user_id: 't7Am7q6O1RgYu_aCX',
                    template_params: {
                        from_name: formData.name,
                        from_email: formData.email,
                        subject: formData.subject || "Message from Portfolio",
                        message: formData.message
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (err) {
            setError('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <>
            {/* Contact Section */}
            <ContactSection id="contact">
                <SectionTitle>Get In Touch</SectionTitle>
                <SectionSubtitle>
                    I'm always open to discussing new opportunities, collaborations, or just chatting about technology. 
                    Use the floating chat button to send me a message!
                </SectionSubtitle>
            </ContactSection>

            {/* Floating Chat Button */}
            <FloatingChatButton
                onClick={togglePopup}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
            >
                <FaComments />
            </FloatingChatButton>

            {/* Chat Popup Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <Overlay
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closePopup}
                        />
                        <ChatModal
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                                x: window.innerWidth <= 768 ? 0 : 20,
                                y: window.innerWidth <= 768 ? 0 : 20
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                x: window.innerWidth <= 768 ? 0 : 20,
                                y: window.innerWidth <= 768 ? 0 : 20
                            }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                                duration: 0.4
                            }}
                        >
                            <ChatHeader>
                                <ChatTitle>
                                    <FaComments />
                                    <span>Let's Chat!</span>
                                </ChatTitle>
                                <CloseButton onClick={closePopup}>
                                    <FaTimes />
                                </CloseButton>
                            </ChatHeader>

                            <ChatContent>
                                {isSubmitted ? (
                                    <SuccessMessage
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <SuccessIcon><FaCheck /></SuccessIcon>
                                        <div>
                                            <h3>Message Sent!</h3>
                                            <p>Thank you for reaching out. I'll get back to you soon.</p>
                                        </div>
                                    </SuccessMessage>
                                ) : (
                                    <ContactForm onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                                disabled={isSubmitting}
                                                maxLength={charLimits.name}
                                            />
                                            {validationErrors.name && (
                                                <ValidationError>
                                                    <FaExclamationCircle /> {validationErrors.name}
                                                </ValidationError>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your.email@example.com"
                                                disabled={isSubmitting}
                                                maxLength={charLimits.email}
                                            />
                                            {validationErrors.email && (
                                                <ValidationError>
                                                    <FaExclamationCircle /> {validationErrors.email}
                                                </ValidationError>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Subject (optional)"
                                                disabled={isSubmitting}
                                                maxLength={charLimits.subject}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <TextArea
                                                name="message"
                                                rows="4"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your message here..."
                                                disabled={isSubmitting}
                                                maxLength={charLimits.message}
                                            />
                                            {validationErrors.message && (
                                                <ValidationError>
                                                    <FaExclamationCircle /> {validationErrors.message}
                                                </ValidationError>
                                            )}
                                        </FormGroup>

                                        {error && (
                                            <ErrorMessage
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {error}
                                            </ErrorMessage>
                                        )}

                                        <SubmitButton
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <ButtonContent>
                                                    <LoadingSpinner />
                                                    <span>Sending...</span>
                                                </ButtonContent>
                                            ) : (
                                                <ButtonContent>
                                                    <FaEnvelope />
                                                    <span>Send Message</span>
                                                </ButtonContent>
                                            )}
                                        </SubmitButton>
                                    </ContactForm>
                                )}

                                {/* Social Links */}
                                <SocialSection>
                                    <SocialLinks>
                                        <SocialLink href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                                            <FaGithub />
                                        </SocialLink>
                                        <SocialLink href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin />
                                        </SocialLink>
                                        <SocialLink href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                                            <FaTwitter />
                                        </SocialLink>
                                        <SocialLink href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                                            <FaInstagram />
                                        </SocialLink>
                                    </SocialLinks>
                                </SocialSection>
                            </ChatContent>
                        </ChatModal>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// FLOATING CHAT STYLES
const FloatingChatButton = styled(motion.button)`
  position: fixed !important;
  bottom: 32px !important;
  right: 32px !important;
  left: auto !important;
  top: auto !important;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: 
    linear-gradient(135deg, 
      rgba(102, 126, 234, 0.9) 0%, 
      rgba(118, 75, 162, 0.8) 50%,
      rgba(102, 126, 234, 1) 100%
    );
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 26px;
  cursor: pointer;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 12px 40px rgba(102, 126, 234, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 9999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  transform-origin: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 70%
    );
    border-radius: 50%;
    animation: buttonShimmer 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes buttonShimmer {
    0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
    50% { transform: translateX(50%) translateY(50%) rotate(180deg); }
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 16px 50px rgba(102, 126, 234, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0) scale(1);
  }

  @media (max-width: 1024px) {
    bottom: 28px !important;
    right: 28px !important;
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    bottom: 24px !important;
    right: 24px !important;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    width: 52px;
    height: 52px;
    bottom: 20px !important;
    right: 20px !important;
    font-size: 20px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);

  @media (max-width: 768px) {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
  }
`;

const ChatModal = styled(motion.div)`
  position: fixed !important;
  bottom: 100px !important;
  right: 24px !important;
  left: auto !important;
  top: auto !important;
  width: 420px;
  max-height: 650px;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.25) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.15) 100%
    );
  backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.05) 0%, 
      transparent 30%, 
      rgba(118, 75, 162, 0.05) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.05) 50%, 
      transparent 70%
    );
    animation: shimmer 3s ease-in-out infinite;
    pointer-events: none;
    z-index: 2;
  }

  @keyframes shimmer {
    0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }

  @media (max-width: 1024px) {
    width: 380px !important;
    bottom: 90px !important;
    right: 20px !important;
  }

  @media (max-width: 768px) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    transform: none !important;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(50px) saturate(200%);
    -webkit-backdrop-filter: blur(50px) saturate(200%);
  }

  @media (max-width: 480px) {
    background: rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(60px) saturate(220%) !important;
    -webkit-backdrop-filter: blur(60px) saturate(220%) !important;
  }
`;

const ChatHeader = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(102, 126, 234, 0.8) 0%, 
      rgba(118, 75, 162, 0.7) 50%,
      rgba(102, 126, 234, 0.9) 100%
    );
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    animation: headerShimmer 4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes headerShimmer {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(300%); }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;

  svg {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 20px;
  }
`;

const ChatContent = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  max-height: 520px;
  position: relative;
  z-index: 5;
  margin-bottom: -1px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const ValidationError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const ContactSection = styled.section`
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${props => props.bgColor || '#e0e5ec'};
  color: #5e6878;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  font-weight: 800;
  color: ${props => props.textColor || '#4a5568'};
  text-shadow: 3px 3px 6px ${props => props.shadowDark || '#a3b1c6'}, 
               -3px -3px 6px ${props => props.shadowLight || '#ffffff'};
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${props => props.textColor || '#5e6878'};
  font-size: 1.2rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  text-shadow: 1px 1px 2px ${props => props.shadowDark || '#a3b1c6'}, 
               -1px -1px 2px ${props => props.shadowLight || '#ffffff'};
`;

const ContactContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactFormWrapper = styled(motion.div)`
  flex: 1;
  min-width: 300px;
  background: ${props => props.bgColor || '#e0e5ec'};
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 8px 8px 16px ${props => props.shadowDark || '#a3b1c6'}, 
              -8px -8px 16px ${props => props.shadowLight || '#ffffff'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 12px 12px 24px ${props => props.shadowDark || '#a3b1c6'}, 
                -12px -12px 24px ${props => props.shadowLight || '#ffffff'};
  }
`;

const FormHeader = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.textColor || '#4a5568'};
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 700;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: ${props => props.accentColor || '#6d5dfc'};
    border-radius: 4px;
    box-shadow: 2px 2px 4px ${props => props.shadowDark || '#a3b1c6'}, 
                -2px -2px 4px ${props => props.shadowLight || '#ffffff'};
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.textColor || '#4a5568'};
  font-size: 0.95rem;
  text-shadow: 1px 1px 1px ${props => props.shadowDark || '#a3b1c6'}, 
               -1px -1px 1px ${props => props.shadowLight || '#ffffff'};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.2) 100%
    );
  backdrop-filter: blur(20px) saturate(180%) brightness(105%);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(105%);
  color: #2d3748;
  position: relative;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.02) 0%, 
      transparent 50%, 
      rgba(118, 75, 162, 0.02) 100%
    );
    border-radius: 16px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.3);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 
      inset 2px 2px 8px rgba(0, 0, 0, 0.15),
      inset -2px -2px 8px rgba(255, 255, 255, 0.8),
      0 0 0 3px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(45, 55, 72, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #2d3748;
  font-family: inherit;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px rgba(255, 255, 255, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.3);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 
      inset 2px 2px 8px rgba(0, 0, 0, 0.15),
      inset -2px -2px 8px rgba(255, 255, 255, 0.8),
      0 0 0 3px rgba(102, 126, 234, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(45, 55, 72, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 100px;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 12px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(102, 126, 234, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 
      0 4px 16px rgba(102, 126, 234, 0.3),
      inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    background: rgba(102, 126, 234, 0.5);
    box-shadow: 
      inset 2px 2px 5px rgba(0, 0, 0, 0.2),
      inset -2px -2px 5px rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    padding: 14px 24px;
    font-size: 1rem;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(231, 247, 237, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(52, 199, 89, 0.2);
  box-shadow: 
    0 8px 32px rgba(52, 199, 89, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  
  h3 {
    color: #1e7e34;
    margin: 0 0 0.3rem 0;
    font-weight: 600;
  }
  
  p {
    color: #2e7d32;
    margin: 0;
    line-height: 1.5;
  }
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #34c759;
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 227, 227, 0.8);
  backdrop-filter: blur(10px);
  color: #d32f2f;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(211, 47, 47, 0.2);
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 
    0 4px 16px rgba(211, 47, 47, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
`;

const ContactInfoWrapper = styled(motion.div)`
  flex: 1;
  min-width: 300px;
  background: ${props => props.bgColor || '#e0e5ec'};
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 8px 8px 16px ${props => props.shadowDark || '#a3b1c6'}, 
              -8px -8px 16px ${props => props.shadowLight || '#ffffff'};
  color: #5e6878;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 12px 12px 24px ${props => props.shadowDark || '#a3b1c6'}, 
                -12px -12px 24px ${props => props.shadowLight || '#ffffff'};
    transform: translateY(-5px);
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.textColor || '#4a5568'};
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const InfoText = styled.p`
  margin-bottom: 1.5rem;
  color: ${props => props.textColor || '#4a5568'};
  line-height: 1.6;
`;

const ContactItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ContactIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.bgColor || '#e0e5ec'};
  border-radius: 50%;
  color: ${props => props.textColor || '#4a5568'};
  box-shadow: 4px 4px 8px ${props => props.shadowDark || '#a3b1c6'}, 
              -4px -4px 8px ${props => props.shadowLight || '#ffffff'};
`;

const ContactText = styled.span`
  color: ${props => props.textColor || '#4a5568'};
  margin-left: 1rem;
  font-weight: 500;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.shadowDark || '#a3b1c6'};
  margin: 1.5rem 0;
`;

const SocialTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.textColor || '#4a5568'};
`;

const SocialSection = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.4), 
      rgba(102, 126, 234, 0.1),
      rgba(255, 255, 255, 0.4),
      transparent
    );
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    padding-top: 16px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  position: relative;
  z-index: 7;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  color: #4a5568;
  text-decoration: none;
  font-size: 1.2rem;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.15) 50%, 
      rgba(255, 255, 255, 0.25) 100%
    );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.03) 0%, 
      transparent 50%, 
      rgba(118, 75, 162, 0.03) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 22px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.08) 50%, 
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.6s ease;
    border-radius: 22px;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    color: #667eea;
    box-shadow: 
      0 10px 30px rgba(102, 126, 234, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }

    &::after {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  &:active {
    transform: translateY(0) scale(1);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

const AvailabilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.bgColor || '#e0e5ec'};
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  color: ${props => props.textColor || '#4a5568'};
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 4px 4px 8px ${props => props.shadowDark || '#a3b1c6'}, 
              -4px -4px 8px ${props => props.shadowLight || '#ffffff'};
`;

const AvailabilityDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: #34c759;
  border-radius: 50%;
`;

export default Contact;