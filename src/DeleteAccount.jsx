import React, { useState } from 'react';

export default function DeleteAccount({ db, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function removeAccount(event) {
    event.preventDefault();
    if (busy || confirmation !== 'DELETE') return;
    setBusy(true); setMessage('');
    try {
      const { error } = await db.functions.invoke('delete-own-account', { body: { confirmation } });
      if (error) {
        let detail = '';
        try { detail = (await error.context?.json())?.error || ''; } catch {}
        throw new Error(detail || 'Unable to delete your account. Please try again or contact the site owner.');
      }
      await db.auth.signOut();
      location.replace('/');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <section className="profile-card" aria-labelledby="delete-account-title">
    <h2 id="delete-account-title">Delete account</h2>
    {isAdmin ? <p>Administrator accounts must be handled by the site owner to protect shared website content.</p> : !open ? <><p>Permanently remove your account, profile, reviews and uploaded account media.</p><button type="button" onClick={() => setOpen(true)}>DELETE ACCOUNT</button></> : <form onSubmit={removeAccount} className="account-form">
      <p>This cannot be undone. Your profile, reviews and uploaded account media will be permanently removed. Your bookings with external providers are not deleted.</p>
      <p>For security, sign out and sign in again if you haven't signed in within the last 15 minutes.</p>
      <label>Type DELETE to confirm<input value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" /></label>
      <button type="submit" disabled={busy || confirmation !== 'DELETE'}>{busy ? 'DELETING…' : 'PERMANENTLY DELETE MY ACCOUNT'}</button>
      <button type="button" disabled={busy} onClick={() => { setOpen(false); setConfirmation(''); setMessage(''); }}>CANCEL</button>
      <p role="status" aria-live="polite">{message}</p>
    </form>}
  </section>;
}

