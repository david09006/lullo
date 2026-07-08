import {data, redirect} from 'react-router';
import type {Route} from './+types/newsletter';
import {isValidEmail} from '~/lib/validation';
import {checkRateLimit} from '~/lib/rate-limit';

export async function action({request}: Route.ActionArgs) {
  const rate = checkRateLimit(request, 'newsletter', {limit: 5, windowMs: 60_000});
  if (!rate.ok) {
    return data(
      {ok: false, message: 'Too many attempts. Please try again in a minute.'},
      {status: 429},
    );
  }

  const form = await request.formData();

  // Honeypot: real users never fill this hidden field. Accept silently so bots
  // don't learn they were caught.
  if (String(form.get('company') ?? '').trim()) {
    return data({ok: true, message: 'You’re in. Talk soon.'});
  }

  const email = String(form.get('email') ?? '');
  if (!isValidEmail(email)) {
    return data({ok: false, message: 'Enter a valid email address.'}, {status: 400});
  }

  // SWAP POINT: forward to your ESP (Klaviyo/Shopify) here. We never log the raw
  // email. For now we accept and confirm.
  return data({ok: true, message: 'You’re in. We’ll keep it calm.'});
}

// No direct GET view for this endpoint.
export async function loader() {
  return redirect('/');
}
