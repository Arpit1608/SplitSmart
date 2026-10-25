import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useForm } from '../hooks/useForm';
import Field from '../components/ui/Field';

export default function AuthPage() {
  const { authenticate } = useAuth();
  const toast = useToast();
  const [signup, setSignup] = useState(false);
  const { values, field } = useForm({ name: '', username: '', email: '', password: '', identity: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await authenticate(signup ? 'signup' : 'login', signup ? values : { identity: values.identity, password: values.password });
      toast(signup ? 'Welcome to SplitSmart!' : 'Welcome back!');
    } catch (err) {
      toast(err.message, true);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-art">
        <div className="art-logo">
          SplitSmart<span>.</span>
        </div>
        <div>
          <h1>
            Good friends.
            <br />
            Clear balances.
          </h1>
          <p>
            All the little expenses, handled together. Track shared plans, settle up without the awkwardness, and get
            back to the good stuff.
          </p>
          <div className="art-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <span style={{ fontSize: 12, color: '#c1d8ce' }}>YOUR GROUP, AT A GLANCE</span>
              <span style={{ color: '#aee7cf' }}>✳</span>
            </div>
            <div style={{ font: '800 27px Manrope', marginBottom: 4 }}>₹2,450.00</div>
            <div style={{ fontSize: 12, color: '#c1d8ce' }}>shared on last weekend's trip</div>
            <div style={{ height: 5, background: '#ffffff22', borderRadius: 5, marginTop: 19 }}>
              <div style={{ height: '100%', width: '70%', background: '#9ce0c3', borderRadius: 5 }} />
            </div>
          </div>
        </div>
        <div className="art-bottom">Made for the plans you make together. ✦</div>
      </section>

      <section className="auth-main">
        <form className="auth-form" onSubmit={submit}>
          <div className="brand" style={{ padding: 0, marginBottom: 38 }}>
            SplitSmart<span>.</span>
          </div>
          <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="sub">
            {signup ? 'Your people, your plans, all in one place.' : 'Pick up where your group left off.'}
          </p>

          {signup ? (
            <>
              <Field label="Your name">
                <input {...field('name')} required autoComplete="name" />
              </Field>
              <Field label="Choose a username">
                <input {...field('username')} required autoComplete="username" />
              </Field>
              <Field label="Email address">
                <input {...field('email')} type="email" required autoComplete="email" />
              </Field>
              <Field label="Password (at least 8 characters)">
                <input {...field('password')} type="password" required minLength={8} autoComplete="new-password" />
              </Field>
            </>
          ) : (
            <>
              <Field label="Username or email">
                <input {...field('identity')} required autoComplete="username" />
              </Field>
              <Field label="Password">
                <input {...field('password')} type="password" required autoComplete="current-password" />
              </Field>
            </>
          )}

          <button className="btn btn-primary btn-full" type="submit">
            {signup ? 'Create account' : 'Log in'} <span>→</span>
          </button>
          <p className="muted" style={{ textAlign: 'center', marginTop: 22 }}>
            {signup ? 'Already have an account?' : 'New to SplitSmart?'}{' '}
            <button type="button" className="link-btn" onClick={() => setSignup(!signup)}>
              {signup ? 'Log in' : 'Create an account'}
            </button>
          </p>
          <p className="tiny muted" style={{ textAlign: 'center', marginTop: 30 }}>
            Your data is saved on the server running this app.
          </p>
        </form>
      </section>
    </div>
  );
}
