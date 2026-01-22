import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, User, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  studentBirthDate: string;
  currentGrade: string;
  previousSchool: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress: string;
  desiredGrade: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const AdmissionsForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentFirstName: '',
    studentLastName: '',
    studentBirthDate: '',
    currentGrade: '',
    previousSchool: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    parentAddress: '',
    desiredGrade: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const [reference, setReference] = useState<string>('');

  const grades = [
    'Petite Section (Maternelle)',
    'Moyenne Section (Maternelle)',
    'Grande Section (Maternelle)',
    'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    '2nde', '1ère', 'Terminale'
  ];


  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'Prénom requis';
      if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Nom requis';
      if (!formData.studentBirthDate) newErrors.studentBirthDate = 'Date de naissance requise';
      if (!formData.desiredGrade) newErrors.desiredGrade = 'Niveau souhaité requis';
    }

    if (step === 2) {
      if (!formData.parentFirstName.trim()) newErrors.parentFirstName = 'Prénom requis';
      if (!formData.parentLastName.trim()) newErrors.parentLastName = 'Nom requis';
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'Email requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Email invalide';
      }
      if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Téléphone requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/admission-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentFirstName: formData.studentFirstName.trim(),
          studentLastName: formData.studentLastName.trim(),
          studentBirthdate: formData.studentBirthDate,
          desiredClass: formData.desiredGrade,
          currentSchool: formData.previousSchool.trim() || undefined,
          parentFirstName: formData.parentFirstName.trim(),
          parentLastName: formData.parentLastName.trim(),
          parentEmail: formData.parentEmail.trim(),
          parentPhone: formData.parentPhone.trim(),
          parentAddress: formData.parentAddress.trim() || undefined,
          message: formData.message.trim() || undefined,
        })
      });

      if (!res.ok) {
        throw new Error('Submit failed');
      }

      const data = await res.json() as { reference: string };
      setReference(data.reference);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting admission form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-blue-800" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Demande envoyée !</h3>
        <p className="text-gray-600 mb-4">
          Votre demande d'admission a été enregistrée. Notre équipe vous contactera sous 48h.
        </p>
        <div className="bg-white rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Votre numéro de référence</p>
          <p className="text-lg font-bold text-blue-800">{reference}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/suivi"
            className="px-6 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors"
          >
            Suivre ma demande
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Conservez ce numéro pour le suivi de votre demande.
        </p>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Élève', icon: User },
    { number: 2, title: 'Parent', icon: Users },
    { number: 3, title: 'Finaliser', icon: GraduationCap }
  ];

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStep >= step.number 
                  ? 'bg-blue-800 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-800' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded ${
                currentStep > step.number ? 'bg-blue-800' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur d'envoi</p>
            <p className="text-red-600 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Student Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'élève</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  name="studentFirstName"
                  value={formData.studentFirstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.studentFirstName ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Prénom de l'élève"
                />
                {errors.studentFirstName && <p className="mt-1 text-sm text-red-500">{errors.studentFirstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="studentLastName"
                  value={formData.studentLastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.studentLastName ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Nom de l'élève"
                />
                {errors.studentLastName && <p className="mt-1 text-sm text-red-500">{errors.studentLastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input
                  type="date"
                  name="studentBirthDate"
                  value={formData.studentBirthDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.studentBirthDate ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                {errors.studentBirthDate && <p className="mt-1 text-sm text-red-500">{errors.studentBirthDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau souhaité *</label>
                <select
                  name="desiredGrade"
                  value={formData.desiredGrade}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.desiredGrade ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white`}
                >
                  <option value="">Sélectionnez un niveau</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors.desiredGrade && <p className="mt-1 text-sm text-red-500">{errors.desiredGrade}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">École actuelle</label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nom de l'établissement actuel"
              />
            </div>
          </div>
        )}

        {/* Step 2: Parent Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du parent/tuteur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  name="parentFirstName"
                  value={formData.parentFirstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parentFirstName ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Votre prénom"
                />
                {errors.parentFirstName && <p className="mt-1 text-sm text-red-500">{errors.parentFirstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  name="parentLastName"
                  value={formData.parentLastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parentLastName ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="Votre nom"
                />
                {errors.parentLastName && <p className="mt-1 text-sm text-red-500">{errors.parentLastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parentEmail ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="votre@email.com"
                />
                {errors.parentEmail && <p className="mt-1 text-sm text-red-500">{errors.parentEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parentPhone ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  placeholder="+225 XX XX XX XX XX"
                />
                {errors.parentPhone && <p className="mt-1 text-sm text-red-500">{errors.parentPhone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                name="parentAddress"
                value={formData.parentAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Votre adresse complète"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif & Message</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Élève:</span>
                  <p className="font-medium text-gray-900">{formData.studentFirstName} {formData.studentLastName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Niveau souhaité:</span>
                  <p className="font-medium text-gray-900">{formData.desiredGrade}</p>
                </div>
                <div>
                  <span className="text-gray-500">Parent/Tuteur:</span>
                  <p className="font-medium text-gray-900">{formData.parentFirstName} {formData.parentLastName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <p className="font-medium text-gray-900">{formData.parentEmail}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message complémentaire (optionnel)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                placeholder="Informations supplémentaires, questions..."
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Soumettre la demande
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdmissionsForm;
