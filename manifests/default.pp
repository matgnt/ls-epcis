
package { "rabbitmq-server":
	ensure => "installed",
}

service { "rabbitmq-server":
	ensure => "running",
	require => Package["rabbitmq-server"],
	enable => "true", # make sure it will be restarted
}

# enable plugins
exec { "enable_plugins":
	path => ["/usr/bin/", "/bin"],
	command => "/usr/lib/rabbitmq/bin/rabbitmq-plugins enable rabbitmq_management",
	unless => "grep rabbitmq_management /etc/rabbitmq/enabled_plugins",
	notify => Service["rabbitmq-server"], # make sure the server will be restarted
	require => Package["rabbitmq-server"],
	environment => "HOME=/root",
}

# mongodb
class {'::mongodb::server':
  noauth => true,
  bind_ip => [],
}
# mongodb client
class {'::mongodb::client':}

# nodejs
package { "nodejs":
	ensure => "installed",
}
