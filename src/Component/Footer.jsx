import { FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 relative inline-block">About<span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-400 rounded-full"></span></h2>
            <p className="text-sm mt-2 text-justify">
              <b>Datatype IT Consulting</b> – Your trusted recruitment partner for top IT talent. We connect businesses with skilled professionals for temporary, permanent, and contract roles.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <FaTwitter className="text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <FaFacebookF className="text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <FaInstagram className="text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <FaLinkedin className="text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 relative inline-block">Quick Links<span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-400 rounded-full"></span></h4>
            <ul className="text-sm mt-2 space-y-1">
              <li><a href="About" className="hover:text-gray-300 transition">About</a></li>
              <li><a href="Blog" className="hover:text-gray-300 transition">Blog</a></li>
              <li><a href="jobPosting" className="hover:text-gray-300 transition">Browse Jobs</a></li>
              <li><a href="FAQs" className="hover:text-gray-300 transition">FAQs</a></li>
            </ul>
          </div>

          {/* Job Seekers Section */}
          <div>
            <h4 className="font-semibold text-white mb-6 relative inline-block">Job Seekers<span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-400 rounded-full"></span></h4>
            <ul className="text-sm mt-2 space-y-1">
              <li className="hover:text-gray-300 transition">How it works</li>
              <li className="hover:text-gray-300 transition">Register</li>
              <li className="hover:text-gray-300 transition">Post Your Skills</li>
              <li className="hover:text-gray-300 transition">Job Search</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-white mb-6 relative inline-block">Have a Question?<span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-400 rounded-full"></span></h4>
            <ul className="text-sm mt-2 space-y-2">
            <li className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-300" />
                </div>
                <span className="text-white text-left">
                  Nandanwan Road, Flat No 101, Maruti Tower, Kabir Nagar Square, Nagpur, Maharashtra 440024, IN
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-blue-300" />
                </div>
                <a href="tel:+917276216671" className="text-white hover:text-white transition-colors">
                  +91 7276216671
                </a>
              </li>
              <li className="flex items-center">
                <div className="mr-3 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-300" />
                </div>
                <a href="mailto:DatatypeIT@gmail.com" className="text-white hover:text-white transition-colors">
                  DatatypeIT@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-blue-700 mt-5 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} DATATYPE IT CONSULTING. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm text-white">
                <li>
                    Privacy Policy
                </li>
                <li>
                    Terms of Service
                </li>
                <li>
                    Cookie Policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
