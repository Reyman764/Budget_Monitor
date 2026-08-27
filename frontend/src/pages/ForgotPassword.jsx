import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import { Field, Input } from '../components/ui/Field';
import api from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to request a reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" description="Enter your email and we will send a secure reset link.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {message && <Callout tone="success">{message}</Callout>}
        {error && <Callout tone="error">{error}</Callout>}
        <Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Button type="submit" variant="primary" size="lg" full disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button>
        <p className="text-center text-[0.875rem] text-ink-soft"><Link to="/login" className="text-sage underline">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  );
}