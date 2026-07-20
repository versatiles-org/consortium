// Attributes that make a link open in a new tab. Only external (http/https) links get
// them — in-page anchors (#…) and mailto: links stay in the same tab / open the mail
// client. Spread onto an <a>:  <a href={x} {...ext(x)}>
export function ext(href: string): { target?: '_blank'; rel?: string } {
	return href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
}
