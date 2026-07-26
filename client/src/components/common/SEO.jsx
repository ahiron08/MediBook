import { useDoctor } from '../../context/DoctorContext';
import { Helmet } from 'react-helmet-async';

const SEO = () => {
  const { profile } = useDoctor();

  if (!profile) return null;

  const seoTitle = profile.seoTitle || `${profile.doctorName} - ${profile.specialization}`;
  const seoDescription = profile.seoDescription || `${profile.doctorName} is a ${profile.specialization} with ${profile.experienceYears} years of experience. Located at ${profile.clinicName}, ${profile.clinicAddress}.`;
  const seoKeywords = profile.seoKeywords || `${profile.specialization}, doctor, ${profile.clinicName}, healthcare`;

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": profile.doctorName,
    "medicalSpecialty": profile.specialization,
    "description": profile.about,
    "telephone": profile.contactNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profile.clinicAddress,
      "addressLocality": profile.city,
      "addressRegion": profile.state,
      "postalCode": profile.pincode,
    },
    "openingHours": profile.clinicTiming,
    "priceRange": `₹${profile.consultationFeeMin} - ₹${profile.consultationFeeMax}`,
    "image": profile.profilePhoto,
    "url": window.location.origin,
  };

  // LocalBusiness JSON-LD for clinic
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": profile.clinicName,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profile.clinicAddress,
      "addressLocality": profile.city,
      "addressRegion": profile.state,
      "postalCode": profile.pincode,
    },
    "telephone": profile.contactNumber,
    "openingHours": profile.clinicTiming,
    "priceRange": `₹${profile.consultationFeeMin} - ₹${profile.consultationFeeMax}`,
    "image": profile.profilePhoto,
    "url": profile.googleMapsLink || window.location.origin,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={profile.profilePhoto || ''} />
      <meta property="og:site_name" content="MediBook" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={window.location.href} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={profile.profilePhoto || ''} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;