"use client";

export function Analytics() {
	const token = process.env.NEXT_PUBLIC_BEAM_TOKEN;
	if (!token) {
		return null;
	}
	return (
		<script src="https://cdn.counter.dev/script.js" data-id="e996993b-acbc-437e-9894-684cb0b07a62" data-utcoffset="1"></script>
	);
}
