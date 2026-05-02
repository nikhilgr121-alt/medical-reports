import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { db, updateDoc } from '../services/firebaseSimulator';

export const OnboardingPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    degree: '',
    weight: '',
    height: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    try {
      const docRef = db.doc(db.collection('users'), user.uid);
      await updateDoc(docRef, {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        degree: formData.degree,
        weight: formData.weight,
        height: formData.height,
        onboarded: true
      });
      await refreshProfile();
    } catch (error) {
      console.error('Onboarding failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-screen pt-24 pb-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Complete Profile</h1>
            <p className="text-slate-500">
              Welcome! Please provide some basic details to get started as a {user.role}.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />

              {user.role === UserRole.PATIENT ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Age"
                      name="age"
                      type="number"
                      placeholder="25"
                      required
                      value={formData.age}
                      onChange={handleChange}
                    />
                    <Select 
                      label="Gender" 
                      name="gender" 
                      required
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                    <Input
                      label="Height (cm)"
                      name="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                  <Select 
                    label="Blood Group" 
                    name="bloodGroup" 
                    required
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                </>
              ) : (
                <Input
                  label="Degree / Specialization"
                  name="degree"
                  placeholder="MBBS, MD Cardiology"
                  required
                  value={formData.degree}
                  onChange={handleChange}
                />
              )}

              <Input
                label="Physical Address"
                name="address"
                placeholder="123 Health St, Medical City"
                required
                value={formData.address}
                onChange={handleChange}
              />

              <Button type="submit" className="w-full h-12" isLoading={loading}>
                Finish Setup
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};
