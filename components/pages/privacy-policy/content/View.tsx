// app/privacy-policy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bluefields Medical',
  description:
    'How Bluefields Medical Limited collects, uses and protects personal data.',
};

const sections = [
  { id: 'introduction', title: '1. Introduction and Policy Statement' },
  { id: 'information-we-collect', title: '2. The information we collect and how we use it' },
  { id: 'use-of-personal-data', title: '3. Use of Personal Data' },
  { id: 'disclosure', title: '4. Disclosure of Personal Data' },
  { id: 'accuracy', title: '5. Accuracy' },
  { id: 'cookies', title: '6. Cookies' },
  { id: 'security', title: '7. Security' },
  { id: 'your-rights', title: '8. Your Rights' },
  { id: 'consent', title: '9. Consent' },
];

export function PrivacyPolicyContentView() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar / breadcrumb */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Privacy Policy</span>
          </nav>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-gray-500">Bluefields Medical Limited</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sticky table of contents (desktop) */}
          <aside className="mb-8 lg:col-span-4 lg:mb-0">
            <div className="sticky top-24 rounded-lg border bg-white p-4">
              <h2 className="text-sm font-medium text-gray-900">On this page</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Policy content */}
          <article className="lg:col-span-8">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              {/* 1 */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">
                  1. Introduction and Policy Statement
                </h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    For the purposes of the General Data Protection Regulation the
                    ‘Data Controller/ Company’ for this website is Bluefields
                    Medical Limited.
                  </p>
                  <p>
                    Any questions regarding this Policy and our privacy practices
                    should be sent by email to{' '}
                    <a
                      href="mailto:contactus@bluefields.uk"
                      className="text-blue-600 underline underline-offset-2"
                    >
                      contactus@bluefields.uk
                    </a>.
                  </p>
                  <p>
                    BLUEFIELDS MEDICAL is committed to respecting, safeguarding and
                    preserving the privacy of all visitors to the Company’s website
                    at <span className="break-all">bluefields.uk</span>. This
                    Internet Privacy Policy (the “Policy”) explains what
                    information is being collected from users of our website and
                    how this information is being stored and used.
                  </p>
                  <p>
                    Please read the Policy carefully to understand the Data
                    Controller/ Company’s practices regarding your personal
                    information and how it is treated. The Policy is regularly
                    evaluated and updated and any changes are posted on this page.
                    Therefore, the Data Controller/ Company asks that all visitors
                    to the website review the Policy frequently.
                  </p>
                  <p>
                    For the purposes of the Data Protection Act 2018, the UK’s
                    interpretation of the GDPR, the data controller is the Company
                    BLUEFIELDS MEDICAL. Any questions, comments or requests
                    regarding the Policy are welcome and should be sent to the
                    Company.
                  </p>
                </div>
              </section>

              <hr className="my-8" />

              {/* 2 */}
              <section id="information-we-collect" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">
                  2. The information we collect and how we use it
                </h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    In order to purchase items from us we need to know your name,
                    address, and email address and various other details. We gather
                    this information to allow us to contact you efficiently and
                    deal with your transaction. The relevant information is then
                    used by us, and our agents to communicate with you regarding
                    our products and services or as otherwise required.
                  </p>
                  <p>
                    If you wish to register for other marketing, for example news
                    etc., you must provide us with your name and email address. You
                    can opt out of this service at any time. Aside from the matters
                    laid out above, your personal data will not be disclosed to any
                    third party save with your consent.
                  </p>
                  <p>
                    We may use your information: to send you communications to
                    which you have opted into or requested or for administrative
                    and business purposes; for advertising and analytical purposes;
                    in connection with our legal rights and obligations; for
                    certain additional purposes but only with your consent. You
                    have a choice about whether or not you wish to receive
                    information from us. If you want to receive communications from
                    us, then you should tick the relevant boxes on the form on
                    which we collect your personal information.
                  </p>
                </div>
              </section>

              <hr className="my-8" />

              {/* 3 */}
              <section id="use-of-personal-data" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">
                  3. Use of Personal Data
                </h2>
                <p className="mt-3 text-gray-800">
                  The Company may use Personal Data, together with any other
                  information, for administration, marketing, customer service,
                  education and account-related activities, with your consent.
                </p>
              </section>

              <hr className="my-8" />

              {/* 4 */}
              <section id="disclosure" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">
                  4. Disclosure of Personal Data
                </h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    The Company will not share your any personal data with any
                    third parties. The Company will only disclose Personal Data:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>When the relevant individual’s consent has been obtained;</li>
                    <li>To other members of the Company’s corporate group;</li>
                    <li>
                      Where the Company is under a public duty to do so e.g. to
                      protect the rights, property or safety of the Company, our
                      scheme members or others;
                    </li>
                    <li>
                      Where information is required to be disclosed by the law or
                      in order to enforce or apply the terms of use of our website
                      or our terms of supply; or
                    </li>
                    <li>
                      If the Company sells any business(es) or assets, or if the
                      Company is itself acquired, in which case we may disclose
                      your personal data to the prospective buyer (as one of the
                      transferring assets).
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="my-8" />

              {/* 5 */}
              <section id="accuracy" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">5. Accuracy</h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    The Company takes reasonable steps to ensure the accuracy of
                    the Personal Data being collected and stored. However, it may
                    not always be possible to ensure that all Personal Data
                    collected and stored is accurate at all times.
                  </p>
                  <p>
                    Members can update their Personal Data in the settings page of
                    their account. Otherwise, Personal Data can be updated by
                    emailing{' '}
                    <a
                      href="mailto:supportteam@bluefields.uk"
                      className="text-blue-600 underline underline-offset-2"
                    >
                      supportteam@bluefields.uk
                    </a>
                    . Please note that it may take up to 31 days for the relevant
                    changes to take place after emailing us.
                  </p>
                </div>
              </section>

              <hr className="my-8" />

              {/* 6 */}
              <section id="cookies" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">6. Cookies</h2>
                <p className="mt-3 text-gray-800">
                  The Company may collect Personal Data, through the use of cookies
                  on its website, in order to distinguish you from other website
                  users/visitors and improve your user experience (and the website
                  itself). Please see the Company’s Cookie Policy for more detailed
                  information.
                </p>
              </section>

              <hr className="my-8" />

              {/* 7 */}
              <section id="security" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">7. Security</h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    All Personal Data provided to us is stored on our secure
                    servers. Any payment transactions will also be encrypted. Where
                    we have given you (or where you have chosen) a password which
                    enables you to access certain parts of the Company’s website,
                    you are responsible for keeping this password confidential. We
                    ask you not to share a password with anyone.
                  </p>
                  <p>
                    Unfortunately, the transmission of information via the Internet
                    is not completely secure. Although the Company will do its best
                    to protect your Personal Data, we cannot guarantee the security
                    of any information that is transmitted to our website and
                    applications; any such transmission is therefore at your own
                    risk. Once we have received your Personal Data, we will use
                    strict procedures and security features to try to prevent any
                    unauthorised access.
                  </p>
                </div>
              </section>

              <hr className="my-8" />

              {/* 8 */}
              <section id="your-rights" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">8. Your Rights</h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Have your personal information amended:</strong> You
                      can also exercise the right to unsubscribe at any time by
                      contacting us at{' '}
                      <a
                        href="mailto:contactus@bluefields.uk"
                        className="text-blue-600 underline underline-offset-2"
                      >
                        contactus@bluefields.uk
                      </a>.
                    </li>
                    <li>
                      <strong>Have your personal information erased:</strong> You
                      have the right to object to us processing your personal
                      information if we are not entitled to use it any more, to
                      have your information deleted if we are keeping it too long
                      or have its processing restricted in certain circumstances –
                      more simply put as your right ‘to be forgotten’. If you would
                      like us to stop processing your personal information please
                      email{' '}
                      <a
                        href="mailto:contactus@bluefields.uk"
                        className="text-blue-600 underline underline-offset-2"
                      >
                        contactus@bluefields.uk
                      </a>.
                    </li>
                    <li>
                      <strong>Complain to the Information Commissioner’s Office:</strong>{' '}
                      You can contact the ICO if you are unhappy with how we have
                      handled your data.
                    </li>
                  </ul>
                  <p>
                    The Company’s website and applications may, from time to time,
                    contain links to and from the websites of our partner networks,
                    advertisers and affiliates. If you follow a link to any of
                    these websites, please note that these websites have their own
                    privacy policies and that the Company does not accept any
                    responsibility or liability for these policies. Please check
                    these policies before you submit any personal data to these
                    websites.
                  </p>
                  <p>
                    The Data Protection Act 2018 gives you the right to access
                    information held about you, which can be exercised in
                    accordance with the Act. Any access request may be subject to a
                    fee of £10.00 to meet the Company’s costs in providing you with
                    details of the information that it holds about you.
                  </p>
                </div>
              </section>

              <hr className="my-8" />

              {/* 9 */}
              <section id="consent" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900">9. Consent</h2>
                <div className="mt-3 space-y-4 text-gray-800">
                  <p>
                    By submitting your information and/or opting in to receiving
                    marketing on the Company’s website and applications, all
                    individuals and companies provide consent for their Personal
                    Data to be collected, processed and stored by the Company, and
                    (where relevant) its partners, in the manner and for the
                    purposes outlined in this Policy. If we change our privacy
                    policy we will post the changes on this page, and may place
                    notices on other pages of the website, so that you may be aware
                    of the information we collect and how we use it at all times.
                    We will also email you should you make any changes so that you
                    may consent to our use of your information in that way.
                    Continued use of the service will signify that you agree to any
                    such changes.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="mailto:contactus@bluefields.uk"
                className="inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Contact us
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Back to home
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
