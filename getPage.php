<?php

if (isset($_POST['steamid'])) {
  $steamid = $_POST['steamid'];
#  exec("/Users/cquintal/Envs/vgstats/bin/python ./steam/steamstats.py $steamid 2> error.txt");
   echo "yes";
}
else {
  exec("python ./steam/steamstats.py");
  echo "no";
}

$location = "/output/output.html";
#header("Location: " . "http://" . $_SERVER['HTTP_HOST'] . $location);
exit;
?>
