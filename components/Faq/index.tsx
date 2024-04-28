import React from 'react';
import { Disclosure } from '@headlessui/react';
import { useTranslations } from 'next-intl';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  faqs: FAQItem[];
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const t = useTranslations();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <dl className="space-y-6 divide-y divide-gray-900/10">
          {faqs.map((faq, index) => (
            <Disclosure as="div" key={index} className="pt-6">
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span className="text-base font-semibold leading-7">{t(faq.question)}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <i className="ri-arrow-up-s-line ri-xl"></i>
                        ) : (
                          <i className="ri-arrow-down-s-line ri-xl"></i>
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p className="text-base leading-7 text-gray-600">{t(faq.answer)}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQAccordion;
