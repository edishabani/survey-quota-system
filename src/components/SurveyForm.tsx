// src/components/SurveyForm.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function SurveyForm() {
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickId, setClickId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clickIdParam = urlParams.get('clickid');
    if (clickIdParam) {
      setClickId(clickIdParam);
    }
  }, []);

  const handleSubmit = async () => {
    if (!gender || !clickId) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          clickId
        })
      });

      const data = await response.json();
      
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white">
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Quick Survey</h1>
          <p className="text-blue-100">
            Help us understand our audience better
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 pb-8">
            <div className="space-y-4">
              <Button
                type="button"
                variant={gender === 'men' ? 'default' : 'outline'}
                className={`w-full py-8 text-lg relative group transition-all duration-200 ${
                  gender === 'men' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:border-blue-200'
                }`}
                onClick={() => setGender('men')}
              >
                I am a Man
                {gender === 'men' && (
                  <ArrowRightIcon className="w-5 h-5 absolute right-4 opacity-70" />
                )}
              </Button>

              <Button
                type="button"
                variant={gender === 'women' ? 'default' : 'outline'}
                className={`w-full py-8 text-lg relative group transition-all duration-200 ${
                  gender === 'women' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'hover:border-blue-200'
                }`}
                onClick={() => setGender('women')}
              >
                I am a Woman
                {gender === 'women' && (
                  <ArrowRightIcon className="w-5 h-5 absolute right-4 opacity-70" />
                )}
              </Button>
            </div>

            {gender && (
              <div className="pt-6">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Continue"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
