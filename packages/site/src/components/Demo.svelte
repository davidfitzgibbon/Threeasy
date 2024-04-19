<script>
	export let title = "Demo";
	export let url = "basic-threeasy-animation-onstv";
</script>

<h3>{title}</h3>

<slot />

<iframe
	class="demo-iframe"
	src="/examples/{url}.html"
	style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
	{title}
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
<a target="_blank" href="/examples/{url}.html">See example</a>

<style>
	h3 {
		font-size: 14px;
		font-weight: 200;
		grid-column-start: 1;
		grid-column-end: 4;
		margin-top: 1em;
		margin-bottom: 0.5em;
	}
	.demo-iframe {
		width: 100%;
		height: 400px;
		grid-column-start: 1;
		grid-column-end: 4;
		margin-bottom: 2em;
	}
</style>
