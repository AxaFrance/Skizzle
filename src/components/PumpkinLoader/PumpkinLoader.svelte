<style>
	.Pumpkin {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		animation: pumpkin 1s infinite;
		background-image: radial-gradient(
			circle at 50% 20%,
			orange 0,
			orangered 100%
		);
		border-radius: 47%;
		// all the box shadows
		box-shadow: 0.25rem 0 0 -0.125rem orangered, 1.5rem 0 0 -0.125rem darkorange,
			1.625rem 0 0 -0.125rem orangered, 2.5rem 0 0 -0.375rem darkorange,
			2.625rem 0 0 -0.375rem maroon, -0.25rem 0 0 -0.125rem orangered,
			-1.5rem 0 0 -0.125rem darkorange, -1.625rem 0 0 -0.125rem orangered,
			-2.5rem 0 0 -0.375rem darkorange, -2.625rem 0 0 -0.375rem maroon,
			0 -0.125rem 0.5rem 0 rgba(0, 0, 0, 0.2), 0 1rem 4rem 2rem rgba(0, 0, 0, 0.5),
			4rem -1rem 7rem rgba(255, 185, 0, 1), -4rem -1rem 7rem rgba(255, 185, 0, 1);
		display: block;
		height: 7.5rem;
		position: relative;
		width: 6rem;
		&::before {
			box-sizing: border-box;
			content: '';
			display: block;
			border-bottom: 1.5rem solid transparent;
			border-left: 1rem solid green;
			border-radius: 50%;
			border-right: 0.25rem solid transparent;
			border-top: 0.5rem solid green;
			box-shadow: inset 2px 4px 0 rgba(0, 0, 0, 0.2);
			height: 3rem;
			left: 40%;
			position: absolute;
			top: -1.35rem;
			width: 3rem;
			z-index: -1;
		}
		&::after {
			content: '';
			display: block;
			background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='gold'%3E%3Cpolygon points='30,20 40,30 20,30' /%3E%3Cpolygon points='70,20 80,30 60,30' /%3E%3Cpath d='m25,60 10,0 0,-10, 10,0 0,10 10,0, 0,-10, 10,0 0,10 10,0, 0,-10 0 20, -10,0 -40,0'/%3E%3C/g%3E%3C/svg%3E"),
				url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='yellow'%3E%3Cpolygon points='30,20 40,30 20,30' /%3E%3Cpolygon points='70,20 80,30 60,30' /%3E%3Cpath d='m25,60 10,0 0,-10, 10,0 0,10 10,0, 0,-10, 10,0 0,10 10,0, 0,-10 0 20, -10,0 -40,0'/%3E%3C/g%3E%3C/svg%3E"),
				url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='orangered'%3E%3Cpolygon points='30,20 40,30 20,30' /%3E%3Cpolygon points='70,20 80,30 60,30' /%3E%3Cpath d='m25,60 10,0 0,-10, 10,0 0,10 10,0, 0,-10, 10,0 0,10 10,0, 0,-10 0 20, -10,0 -40,0'/%3E%3C/g%3E%3C/svg%3E");
			background-position: left 1rem top 1rem, left 1rem top 0.875rem,
				left 1rem top 1.125rem;
			background-repeat: no-repeat;
			background-size: 7rem auto;
			height: 9rem;
			left: 50%;
			position: absolute;
			top: 50%;
			transform: translatex(-50%) translatey(-45%);
			width: 9rem;
			z-index: 2;
		}
	}

	@keyframes pumpkin {
		0% {
			transform: translateX(-50%) translateY(-50%) rotateZ(30deg);
		}
		50% {
			transform: translateX(-50%) translateY(-50%) rotateZ(-30deg);
		}
		100% {
			transform: translateX(-50%) translateY(-50%) rotateZ(30deg);
		}
	}
</style>

<!-- Pumpkin illustration from https://codepen.io/paddyduke/pen/Rwajyjz -->
<div class="Pumpkin" />
