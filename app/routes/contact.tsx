import {Form, data, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/contact';
import {sanitizeText, validateFields, type ValidationErrors} from '~/lib/validation';
import {checkRateLimit} from '~/lib/rate-limit';
import {assertSameOrigin} from '~/lib/security';

type ContactValues = {name: string; email: string; message: string};

export const meta: Route.MetaFunction = () => [
  {title: 'Contact — Lullo'},
  {name: 'description', content: 'Questions about calming gear, an order, or your dog? Talk to a real person.'},
];

export async function action({request}: Route.ActionArgs) {
  assertSameOrigin(request);
  const rate = checkRateLimit(request, 'contact', {limit: 5, windowMs: 60_000});
  if (!rate.ok) {
    const errors: ValidationErrors = {
      form: 'Too many messages. Please try again shortly.',
    };
    return data(
      {ok: false as const, errors, values: undefined as ContactValues | undefined},
      {status: 429},
    );
  }

  const form = await request.formData();

  // Honeypot — bots fill this; humans can't see it.
  if (String(form.get('company') ?? '').trim()) {
    return data({ok: true as const});
  }

  const values: ContactValues = {
    name: sanitizeText(form.get('name'), 100),
    email: sanitizeText(form.get('email'), 254),
    message: sanitizeText(form.get('message'), 2000),
  };

  const errors = validateFields(values, {
    name: {required: true, min: 2, max: 100},
    email: {required: true, email: true},
    message: {required: true, min: 10, max: 2000},
  });

  if (Object.keys(errors).length > 0) {
    return data({ok: false as const, errors, values}, {status: 400});
  }

  // SWAP POINT: deliver to your inbox/helpdesk (e.g. email API, Intercom).
  // We never log message contents.
  return data({ok: true as const});
}

export default function ContactRoute() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const submitting = nav.state !== 'idle';
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;
  const values = actionData && !actionData.ok ? actionData.values : undefined;

  if (actionData?.ok) {
    return (
      <div className="page container-narrow container contact">
        <div className="contact__success">
          <p className="eyebrow">Contact</p>
          <h1 className="page-hero__title">Got it — talk soon.</h1>
          <p className="lede">
            Thanks for reaching out. We read every message and usually reply the
            same day. Go give your dog a scratch from us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container-narrow container contact">
      <header className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1 className="page-hero__title">Say hello.</h1>
        <p className="lede">
          Sizing help, an order question, or just want to send a photo of your
          dog? We’re here — a real person, usually same day.
        </p>
      </header>

      <Form method="POST" className="contact__form" noValidate>
        {errors?.form ? (
          <p className="field-error" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="field">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values?.name}
            aria-invalid={Boolean(errors?.name)}
            aria-describedby={errors?.name ? 'name-error' : undefined}
            required
          />
          {errors?.name ? (
            <p className="field-error" id="name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            aria-invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? 'email-error' : undefined}
            required
          />
          {errors?.email ? (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            defaultValue={values?.message}
            aria-invalid={Boolean(errors?.message)}
            aria-describedby={errors?.message ? 'message-error' : undefined}
            required
          />
          {errors?.message ? (
            <p className="field-error" id="message-error">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot: visually hidden, not announced, no tab stop. */}
        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </Form>
    </div>
  );
}
