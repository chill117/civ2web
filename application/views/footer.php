
<script class="template" data-name="window" type="text/html">
		<div class="window {name}">

			<div class="border-1">
				<div class="border-2">
					<div class="border-3">
						<div class="border-4">

							<div class="inner">

								<menu class="menu">{menu}</menu>

								<h3 class="title">{title}</h3>

								<div class="content-border-1">
									<div class="content">{content}</div>
								</div>

							</div>

						</div>
					</div>
				</div>
			</div>

		</div>
</script>


<?php if (count($load_js) > 0): foreach ($load_js as $src): ?>

	<script src="<?= $src ?>"></script><?php endforeach; endif; ?>

</body>
</html>