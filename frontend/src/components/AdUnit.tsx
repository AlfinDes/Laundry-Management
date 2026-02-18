import { useEffect } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: 'true' | 'false';
    style?: React.CSSProperties;
    className?: string;
}

/**
 * Reusable AdSense Unit Component
 */
const AdUnit = ({ slot, format = 'auto', responsive = 'true', style, className }: AdUnitProps) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, [slot]); // Re-push if slot changes

    return (
        <div className={`ad-container ${className || ''}`} style={{ margin: '20px 0', textAlign: 'center', ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-5638152523946981"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            ></ins>
        </div>
    );
};

export default AdUnit;
