export interface PrivacyPolicyContentViewData {
    company_info: string;
    country_info: string;
    website_info: {
        url: string;
        title: string;
    };
    by_phone_number: string;

}

interface PrivacyPolicyContentViewProps {
    data: PrivacyPolicyContentViewData;
}

export function PrivacyPolicyContentView({ data }: PrivacyPolicyContentViewProps) {
    return (
        <section className="relative min-h-[660px] flex items-center justify-center overflow-hidden">
            
        </section>
    );
}