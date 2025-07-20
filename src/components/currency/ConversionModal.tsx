import React, { useState, useEffect } from 'react';
import { 
  RiArrowUpDownLine, 
  RiCloseLine, 
} from '@remixicon/react';
import axios from "../../axios";
import { ErrorToast } from '../common/Toaster';

interface Currency {
  name: string;
  code: string;
}

interface Currencies {
  [key: string]: Currency;
}

interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
}

interface FormData {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
}

interface FormErrors {
  amount?: string;
  fromCurrency?: string;
  toCurrency?: string;
}

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;

}

const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const [currencies, setCurrencies] = useState<Currencies>({});
  const [currenciesLoading, setCurrenciesLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

 
 
  useEffect(() => {
    if (isOpen && Object.keys(currencies).length === 0) {
      fetchCurrencies();
    }
  }, [isOpen, currencies]);

  const fetchCurrencies = async (): Promise<void> => {
    try {
      setCurrenciesLoading(true);
      const response = await axios.get<{ data: Currencies }>('/currencies');
      setCurrencies(response.data.data || {});
    } catch (error: any) {
      console.error('Error fetching currencies:', error);
        ErrorToast(error?.message || "Something went wrong")
    } finally {
      setCurrenciesLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive';
    } else if (parseFloat(formData.amount) < 0.01) {
      newErrors.amount = 'Minimum amount is 0.01';
    }
    
    if (!formData.fromCurrency) {
      newErrors.fromCurrency = 'From currency is required';
    }
    
    if (!formData.toCurrency) {
      newErrors.toCurrency = 'To currency is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const response = await axios.post<ConversionResult>('/currencies/convert', {
        from: formData.fromCurrency,
        to: formData.toCurrency,
        amount: parseFloat(formData.amount)
      });

      setResult(response.data);

      if(response?.data){
        onSuccess()
        closeModal();
      }
      
      
      
    } catch (error) {
      ErrorToast('Failed to convert currency. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    name: keyof FormData, 
    value: string
  ): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const swapCurrencies = (): void => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
    setResult(null);
  };


  const closeModal = (): void => {
    setResult(null);
    setFormData({ amount: '', fromCurrency: 'USD', toCurrency: 'EUR' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-primary text-white">
          <h2 className="text-xl font-semibold">Currency Converter</h2>
          <div className="flex items-center gap-2">
           
            <button
              onClick={closeModal}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Form */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label 
                  htmlFor="amount" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('amount', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
                )}
              </div>

              {/* Currency Selectors */}
              <div className="space-y-4">
                {/* From Currency */}
                <div>
                  <label 
                    htmlFor="fromCurrency" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    From
                  </label>
                  <select
                    id="fromCurrency"
                    value={formData.fromCurrency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      handleInputChange('fromCurrency', e.target.value)
                    }
                    disabled={currenciesLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                  >
                    {currenciesLoading ? (
                      <option>Loading currencies...</option>
                    ) : (
                      Object.entries(currencies).map(([code, currency]) => (
                        <option key={code} value={code}>
                          {code} - {currency.name || currency.code}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.fromCurrency && (
                    <div className="text-red-500 text-sm mt-1">{errors.fromCurrency}</div>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapCurrencies}
                    disabled={currenciesLoading}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                  >
                    <RiArrowUpDownLine size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* To Currency */}
                <div>
                  <label 
                    htmlFor="toCurrency" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    To
                  </label>
                  <select
                    id="toCurrency"
                    value={formData.toCurrency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      handleInputChange('toCurrency', e.target.value)
                    }
                    disabled={currenciesLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100"
                  >
                    {currenciesLoading ? (
                      <option>Loading currencies...</option>
                    ) : (
                      Object.entries(currencies).map(([code, currency]) => (
                        <option key={code} value={code}>
                          {code} - {currency.name || currency.code}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.toCurrency && (
                    <div className="text-red-500 text-sm mt-1">{errors.toCurrency}</div>
                  )}
                </div>
              </div>

              {/* Convert Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || currenciesLoading}
                className="w-full bg-green-primary text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Converting...
                  </span>
                ) : (
                  'Convert'
                )}
              </button>
            </div>

            
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterModal;