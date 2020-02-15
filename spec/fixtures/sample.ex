defmodule App do
  defstruct [ :first_name, :middle_name, :last_name, :suffix, :employee_id, admin: false, validated: false ]

  def sum(range, _opts) do
        Enum.reduce(             range, 0,
      fn(x), acc
      -> x + acc end
    )
  end

  def pipelines(some_string, lead_padding \\ "+", trail_padding \\ "-") do
    some_string |> String.downcase() |> String.pad_leading(100, lead_padding) |> String.pad_trailing(100, trail_padding)
  end
end
