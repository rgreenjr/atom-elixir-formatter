defmodule App do
  defstruct [ :first_name, :middle_name, :last_name, :suffix, :employee_id, admin: false, validated: false ]

  def sum(range, _opts) do
        Enum.reduce(
    range, 0,
      fn(x), acc
      -> x + acc end
    )
  end

  def pipelines(some_string, lead_padding \\ "+", trail_padding \\ "-") do
    some_string |> String.downcase() |> String.pad_leading(100, lead_padding) |> String.pad_trailing(100, trail_padding)
  end

  defp complex_guard(operation, args, ref) when is_atom(operation) and operation not in @unary_ops when is_map(args) and map_size(map) > 2 when is_list(ref) or not is_nil(ref) or is_float(args) do
    true
  end

  def bad_spacing(options \\ []) do
    sum = 1+1
{a1,a2} = {2 ,3          }
angle = -   45
^ result = Float.parse("42.01")
  end

  defp do_sum([], total), do: total
  defp do_sum([head | tail], total), do: do_sum(tail, head + total)
end
