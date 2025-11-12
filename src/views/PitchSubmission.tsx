import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Building,
  Target,
  Users,
  Calendar,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Send,
  AlertCircle
} from 'lucide-react';

interface FormData {
  projectIdentification: string;
  researchQuestion: string;
  explorationPlan: string;
  partners: string;
  successMeasurement: string;
  category: string;
  timeline: string;
  resources: string;
}

const PitchSubmission: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectIdentification: '',
    researchQuestion: '',
    explorationPlan: '',
    partners: '',
    successMeasurement: '',
    category: '',
    timeline: '',
    resources: ''
  });

  const steps = [
    { number: 1, title: 'Project Context', icon: Building },
    { number: 2, title: 'Research Question', icon: Target },
    { number: 3, title: 'Methodology', icon: Lightbulb },
    { number: 4, title: 'Partners & Resources', icon: Users },
    { number: 5, title: 'Success Metrics', icon: CheckCircle }
  ];

  const categories = [
    'Campus Life',
    'Fine Arts',
    'Health & Safety',
    'Immersive Learning',
    'Psychology',
    'Sustainability'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Submitting pitch:', formData);
    // Here you would typically send the data to your backend
    alert('Pitch submitted successfully! The GreenLight team will review within 2 weeks.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Identification</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Identify the current or future project you want to explore
              </p>
              <textarea
                value={formData.projectIdentification}
                onChange={(e) => handleInputChange('projectIdentification', e.target.value)}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
                placeholder="E.g., Kennedy Elementary School renovation focusing on experiential learning spaces..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Research Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('category', cat)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.category === cat
                        ? 'border-research-sky bg-research-sky/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-research-sky/50'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Research Question</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What is your research question under Experiential Learning?
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <AlertCircle className="inline w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Frame your question as "How does X affect Y?" to ensure it's measurable and focused
                </span>
              </div>

              <textarea
                value={formData.researchQuestion}
                onChange={(e) => handleInputChange('researchQuestion', e.target.value)}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
                placeholder="E.g., How does biophilic design in elementary classrooms affect student attention span and emotional regulation?"
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-research-sky/10 to-research-purple/10 rounded-lg">
              <h3 className="font-semibold mb-2">Research Question Components</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Independent Variable (what you're changing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Dependent Variable (what you're measuring)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Connection to Experiential Learning</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Exploration Plan</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Describe your methodology, timeline, and resources needed
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Methodology</label>
                  <textarea
                    value={formData.explorationPlan}
                    onChange={(e) => handleInputChange('explorationPlan', e.target.value)}
                    className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-24"
                    placeholder="E.g., Literature review of 5+ sources, post-occupancy evaluation survey, case study analysis..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">Select timeline</option>
                    <option value="simple">Simple & Quick (20-60 hours)</option>
                    <option value="medium">Medium Intensity (60-120 hours)</option>
                    <option value="complex">Complex & Long-term (120+ hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Resources Needed</label>
                  <input
                    type="text"
                    value={formData.resources}
                    onChange={(e) => handleInputChange('resources', e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    placeholder="E.g., Survey tools, site visits, publication costs..."
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Partners & Support</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Identify Pfluger partners and supporting sources
              </p>

              <textarea
                value={formData.partners}
                onChange={(e) => handleInputChange('partners', e.target.value)}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
                placeholder="E.g., Senior architects with K-12 expertise, UTSA faculty collaborators, Wood Works for mass timber research..."
              />

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <Lightbulb className="inline w-4 h-4 mr-2" />
                  The GreenLight team can help identify partners if you don't have specific ones in mind
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Success Measurement</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                How will you measure success and demonstrate project integration?
              </p>

              <textarea
                value={formData.successMeasurement}
                onChange={(e) => handleInputChange('successMeasurement', e.target.value)}
                className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
                placeholder="E.g., Publication in Texas Architect, integration into 2 active projects, 80% positive feedback from POE survey..."
              />
            </div>

            <div className="p-6 bg-gradient-to-br from-research-olive/10 to-research-lime/10 rounded-lg">
              <h3 className="font-semibold mb-3">Review Your Pitch</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {formData.category || 'Not selected'}
                </div>
                <div>
                  <span className="font-medium">Timeline:</span> {formData.timeline || 'Not selected'}
                </div>
                <div>
                  <span className="font-medium">Research Question:</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {formData.researchQuestion || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-research-orange to-research-lime rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Submit Research Pitch</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transform your research idea into architectural reality
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-research-sky to-research-blue shadow-lg'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Title */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep} of {steps.length}
        </p>
        <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:shadow-lg'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </motion.button>

        {currentStep === steps.length ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-research-sky to-research-blue text-white rounded-lg font-medium shadow-lg"
          >
            Submit Pitch
            <Send className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-research-sky to-research-blue text-white rounded-lg font-medium shadow-lg"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default PitchSubmission;