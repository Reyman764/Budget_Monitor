import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import { Field, Input } from '../components/ui/Field';
import api from '../utils/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" description="Use at least 6 characters.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <Callout tone="error">{error}</Callout>}
        <Field label="New password" htmlFor="password"><Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        <Field label="Confirm password" htmlFor="confirmPassword"><Input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></Field>
        <Button type="submit" variant="primary" size="lg" full disabled={loading}>{loading ? 'Updating…' : 'Update password'}</Button>
        <p className="text-center text-[0.875rem] text-ink-soft"><Link to="/login" className="text-sage underline">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  );
}