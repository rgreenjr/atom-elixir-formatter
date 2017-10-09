defmodule App do
  @number 123456789
  @very_long = %{ foo: "bar", baz: "1", bar: "bar", quux: "bar", banana: "bar", apple: "bar",
ananas: "bar", morestuff: "bar", katonka: "bar" }

  def one() do
  Enum.map [
    "one",           <<"two">>,
    "three"],
        fn(num)        -> IO.puts   (num)
    end
  end

  def case_assignment() do
    result = case some_function() do
      :ok -> true
      _ -> false
    end
  end

  def pipeline_assignment(some_string) do
    result = some_string |> String.downcase |> String.strip
  end

  defp valid?(character) when character in ?a..?z when character in ?A..?Z when character in ?0..?9 when character == ?_ do
    true
  end

  defp complex_guard(operation, args, ref) when is_atom(operation)
    and not operation in @unary_ops and not operation in @binary_ops when is_map(args) and map_size(map) > 2 when is_list(ref)
    or not is_nil(ref) or is_float(args) or is_integer(ref) and rem(ref, 2) == 0 do
    true
  end

  # comment
  def wrong_spacing(options\\[])
  do
    sum = 1+1
{a1,a2} = {2 ,3
}
Enum.join( [ "one" , << "two" >>, sum ])
angle = - 45
^ result = Float.parse("42.01")
  end

  # trailing comment
end
