import { motion } from 'framer-motion';
import { Mail, Send, Building2, MapPin, Lock } from 'lucide-react';
import { useState } from 'react';

const Collaborate: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', organization: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Collaborate With Us
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Interested in partnering on research or learning more about our work?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card border border-neon-red-500/20 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Send className="w-6 h-6 text-neon-red-500" />
              Get in Touch
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Confidential Inquiry Toggle */}
                <motion.button
                  type="button"
                  onClick={() => setIsConfidential(!isConfidential)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    isConfidential
                      ? 'border-neon-red-500/50 bg-neon-red-500/10'
                      : 'border-dark-border bg-dark-bg hover:border-neon-red-500/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock className={`w-4 h-4 ${isConfidential ? 'text-neon-red-500' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${isConfidential ? 'text-neon-red-400' : 'text-gray-400'}`}>
                    {isConfidential ? 'Confidential Inquiry' : 'Mark as Confidential'}
                  </span>
                </motion.button>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-gray-500 focus:border-neon-red-500/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-gray-500 focus:border-neon-red-500/50 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-gray-500 focus:border-neon-red-500/50 focus:outline-none transition-colors"
                    placeholder="School district, institution, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder:text-gray-500 focus:border-neon-red-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your interest in collaborating..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-neon-red-500 hover:bg-neon-red-600 disabled:bg-neon-red-500/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-dark-card border border-neon-red-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Research & Benchmarking
              </h2>
              <p className="text-gray-400 mb-6">
                Our team explores innovative approaches to educational architecture,
                focusing on student well-being, sustainability, and learning outcomes.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-neon-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Pfluger Architects</p>
                    <p className="text-sm text-gray-400">Research & Benchmarking Department</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neon-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Austin, Texas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neon-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <a href="mailto:research@pflugerarchitects.com" className="text-sm text-neon-red-400 hover:text-neon-red-300 transition-colors">
                      research@pflugerarchitects.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neon-red-500/10 to-neon-red-600/10 border border-neon-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Partnership Opportunities
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-neon-red-500 mt-1">•</span>
                  <span>Collaborative research projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-red-500 mt-1">•</span>
                  <span>Educational facility studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-red-500 mt-1">•</span>
                  <span>Speaking engagements and workshops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-red-500 mt-1">•</span>
                  <span>Data sharing and benchmarking</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Collaborate;
