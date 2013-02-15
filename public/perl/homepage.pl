use strict;
use warnings;
use LWP::UserAgent;
use HTML::TokeParser::Simple;

my $parser = HTML::TokeParser::Simple->new(url => 'http://www.vt.edu/spotlight/'); 

my @titles;
my @summaries;
my @links;

print $parser;

while ( my $div = $parser->get_tag('div') ) {
	my $id = $div->get_attr('id');
	next unless defined($id) and $id eq 'vt_sn_spotlight';

	my $anchor = $div->get_tag('a');
	my $href = $anchor->get_tag('href');
	my $title = $anchor->get_attr('title');
	my $summary = $div->get_tag('div');
	push @links, $href;
	push @titles, [$anchor->get_trimmed_text('/a'), $1];
	push @summaries, [$summary->get_trimmed_text('/a'), $1];
}

use Data::Dumper;
print Dumper \@titles;
print Dumper \@links;
print Dumper \@summaries;
