import React from "react";
import vpnImg from '../assests/VPN.jpg';
import ipImg from '../assests/IP.jpg';
import dnsImg from '../assests/DNS.jpg';
import firewallImg from '../assests/FIRE.jpg';
import sniffingImg from '../assests/SNIF.jpg';

const detailedBlogs = [
  {
    id: 1,
    title: "VPN Security",
    image: vpnImg,
    content: `
      <p>VPNs (Virtual Private Networks) play a crucial role in today's digital world by creating a secure and encrypted connection between your device and the internet. When you connect to a VPN, your internet traffic is routed through a secure tunnel to a VPN server, masking your IP address and encrypting all the data you send and receive.</p>
      <p>This process helps protect your privacy by preventing hackers, ISPs, or government agencies from spying on your online activities. VPNs are especially useful when using public Wi-Fi networks, where data interception risks are higher.</p>
      <p>Furthermore, VPNs enable users to bypass geo-restrictions and censorship by allowing access to content that may be blocked in certain regions. This is valuable for streaming services, accessing restricted websites, or communicating securely while traveling.</p>
      <p>However, it’s important to select a trustworthy VPN provider that guarantees no logging of your activities and provides robust encryption standards. Free VPN services often come with risks such as data selling or weak security.</p>
      <p>Overall, VPNs enhance online privacy, improve security, and expand access to the open internet, making them an essential tool for many internet users.</p>
    `
  },
  {
    id: 2,
    title: "IP Address Tracking",
    image: ipImg,
    content: `
      <p>An IP address is a unique string of numbers assigned to every device connected to the internet. It functions similarly to a postal address, allowing data to be sent and received between devices across the world.</p>
      <p>IP address tracking involves identifying the geographic location, ISP, and sometimes even the approximate user details based on their IP address. This is commonly used by websites and network administrators to analyze traffic patterns, detect fraud, or customize content based on location.</p>
      <p>For example, online retailers may show different products or pricing depending on the visitor's IP-based location. Similarly, cybersecurity systems use IP tracking to block malicious IPs or identify suspicious login attempts.</p>
      <p>However, it’s important to note that IP tracking has its limitations. Many users connect through proxies, VPNs, or shared networks, which can mask their real IP address. Additionally, IP addresses can be dynamic, changing periodically, reducing the accuracy of tracking.</p>
      <p>Despite these challenges, IP address tracking remains a fundamental technology in internet networking, analytics, and security enforcement.</p>
    `
  },
  {
    id: 3,
    title: "DNS Explained",
    image: dnsImg,
    content: `
      <p>The Domain Name System (DNS) is a foundational technology that makes the internet user-friendly. It translates human-readable domain names like <em>example.com</em> into machine-readable IP addresses such as <em>192.0.2.1</em>.</p>
      <p>Whenever you type a URL in your browser, a DNS query is sent to a DNS server, which responds with the corresponding IP address of the website you want to visit. Without DNS, you would need to remember numeric IP addresses to access websites, which is impractical.</p>
      <p>DNS also supports various types of records, including:</p>
      <ul>
        <li><strong>A records:</strong> Map domain names to IPv4 addresses.</li>
        <li><strong>AAAA records:</strong> Map domain names to IPv6 addresses.</li>
        <li><strong>MX records:</strong> Specify mail servers for the domain.</li>
        <li><strong>CNAME records:</strong> Alias one domain name to another.</li>
      </ul>
      <p>Because DNS is critical infrastructure, it is also a target for attacks such as DNS spoofing or cache poisoning, which can redirect users to malicious websites. DNS security extensions (DNSSEC) help mitigate such threats by verifying the authenticity of DNS responses.</p>
      <p>Understanding DNS helps in troubleshooting connectivity issues, configuring websites, and enhancing security measures.</p>
    `
  },
  {
    id: 4,
    title: "Firewall Basics",
    image: firewallImg,
    content: `
      <p>Firewalls are a fundamental component of network security, acting as barriers that control incoming and outgoing network traffic based on predefined security rules. They protect devices and networks from unauthorized access and cyber threats.</p>
      <p>There are different types of firewalls:</p>
      <ul>
        <li><strong>Network firewalls:</strong> Positioned between your internal network and the internet, filtering traffic based on IP addresses, ports, and protocols.</li>
        <li><strong>Host-based firewalls:</strong> Software installed on individual devices to monitor and control network traffic at the device level.</li>
      </ul>
      <p>Firewalls can block suspicious traffic, prevent malware propagation, and restrict access to unsafe websites or services. They are configured with rules that allow trusted traffic and deny unauthorized requests.</p>
      <p>While firewalls provide essential protection, they are only one part of a multi-layered security strategy. Combining firewalls with antivirus software, intrusion detection systems, and secure authentication provides stronger defense.</p>
      <p>Proper firewall configuration and regular updates are critical to ensure security without disrupting legitimate network operations.</p>
    `
  },
  {
    id: 5,
    title: "Network Sniffing",
    image: sniffingImg,
    content: `
      <p>Network sniffing is the process of capturing and analyzing data packets traveling through a computer network. It is often used by network administrators for monitoring network performance, troubleshooting, and ensuring security compliance.</p>
      <p>Sniffing tools can intercept data such as emails, passwords, and other unencrypted communications. While this can be useful for legitimate purposes, it can also be exploited by attackers to steal sensitive information.</p>
      <p>Common sniffing tools include Wireshark, tcpdump, and Ettercap. These tools provide detailed insights into the network traffic, helping detect anomalies, diagnose network issues, or analyze bandwidth usage.</p>
      <p>To protect against unauthorized sniffing, networks can use encryption protocols like SSL/TLS and VPNs, which secure data so that sniffers cannot read the content.</p>
      <p>Understanding sniffing techniques is important for both cybersecurity professionals and regular users to recognize the risks and apply appropriate safeguards.</p>
    `
  }
];

export default function Blogs() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-16">
      <h1 className="text-5xl font-bold mb-12 text-center">Blogs</h1>

      {detailedBlogs.map(({ id, title, image, content }) => (
        <article key={id} className="border-b pb-12 last:border-none">
          <h2 className="text-3xl font-semibold mb-4">{title}</h2>
          <img 
            src={image} 
            alt={title} 
            className="rounded mb-6 object-contain h-48 mx-auto" 
            style={{ maxWidth: '100%' }} 
          />
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      ))}
    </div>
  );
}
