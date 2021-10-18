from flask_assets import Bundle

bundles = {
    'main_css': Bundle(
        'styles/scss/main.scss',
        filters='libsass',
        depends='styles/scss/*.scss',
        output='styles/css/main_css.$(version)s.css'
    ),
}
